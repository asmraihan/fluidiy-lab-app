import { createUser, generateToken } from '@/lib/db';

async function handler(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password);
    const token = generateToken(user);

    return Response.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error in signup:", error);
    return Response.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export default handler;