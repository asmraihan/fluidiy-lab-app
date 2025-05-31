import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import * as Crypto from 'expo-crypto';


const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL || '');
const JWT_SECRET = process.env.EXPO_PUBLIC_JWT_SECRET || 'your-secret-key';
console.log(sql, 'SQL Client Initialized');

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(6),
  created_at: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO users (email, password)
    VALUES (${email}, ${hashedPassword})
    RETURNING id, email, password, created_at;
  `;

  return UserSchema.parse(result[0]);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email};
  `;

  return result[0] ? UserSchema.parse(result[0]) : null;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateToken(user: User): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  const payloadString = JSON.stringify(payload);
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    payloadString + JWT_SECRET
  );

  return Buffer.from(JSON.stringify({
    payload,
    signature
  })).toString('base64');
}

export async function verifyToken(token: string): Promise<{ userId: number; email: string } | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { payload, signature } = decoded;

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Verify signature
    const expectedSignature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      JSON.stringify(payload) + JWT_SECRET
    );

    if (signature !== expectedSignature) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
}

export async function saveAnalysisResult(userId: number, result: any) {
  const response = await sql`
    INSERT INTO analysis_results (user_id, result_data)
    VALUES (${userId}, ${JSON.stringify(result)})
    RETURNING *;
  `;

  return response[0];
}

export async function getAnalysisHistory(userId: number) {
  const results = await sql`
    SELECT * FROM analysis_results
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;

  return results;
}