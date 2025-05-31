import { neon } from "@neondatabase/serverless";
import bcrypt from 'bcryptjs';
import * as Crypto from 'expo-crypto';

const JWT_SECRET = process.env.EXPO_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
    console.log("Received request for user API");
  try {
    const { action, ...body } = await request.json();
    const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL || '');

    // Handle signup
    if (action === 'signup') {
      const { email, password } = body;
      
      if (!email || !password) {
        return Response.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Check if user exists
      const existingUser = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;

      if (existingUser.length > 0) {
        return Response.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await sql`
        INSERT INTO users (email, password)
        VALUES (${email}, ${hashedPassword})
        RETURNING id, email, created_at
      `;

      // Generate token
      const payload = {
        userId: newUser[0].id,
        email: newUser[0].email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      };

      const payloadString = JSON.stringify(payload);
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payloadString + JWT_SECRET
      );

      return Response.json({
        success: true,
        token,
        user: {
          id: newUser[0].id,
          email: newUser[0].email
        }
      }, { status: 201 });
    }

    // Handle signin
    if (action === 'signin') {
      const { email, password } = body;
      
      if (!email || !password) {
        return Response.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Get user
      const users = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;

      if (users.length === 0) {
        return Response.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return Response.json(
          { error: "Invalid password" },
          { status: 401 }
        );
      }

      // Generate token
      const payload = {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      };

      const payloadString = JSON.stringify(payload);
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payloadString + JWT_SECRET
      );

      return Response.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    }

    // Return 404 for unknown actions
    return Response.json(
      { error: "Invalid action" },
      { status: 404 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}