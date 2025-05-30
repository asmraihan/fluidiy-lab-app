import { createUser, getUserByEmail, verifyPassword, generateToken } from '@/lib/db';

export async function POST(request: Request) {
  const { path, ...body } = await request.json();

  if (path === '/auth/signup') {
    try {
      const { email, password } = body;
      const existingUser = await getUserByEmail(email);
      
      if (existingUser) {
        return new Response('User already exists', { status: 400 });
      }
      
      const user = await createUser(email, password);
      const token = generateToken(user);
      
      return Response.json({ token });
    } catch (error) {
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (path === '/auth/signin') {
    try {
      const { email, password } = body;
      const user = await getUserByEmail(email);
      
      if (!user) {
        return new Response('User not found', { status: 404 });
      }
      
      const isValid = await verifyPassword(password, user.password);
      
      if (!isValid) {
        return new Response('Invalid password', { status: 401 });
      }
      
      const token = generateToken(user);
      return Response.json({ token });
    } catch (error) {
      return new Response('Error signing in', { status: 500 });
    }
  }

  return new Response('Not found', { status: 404 });
}