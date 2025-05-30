import { verifyToken } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = auth.split(' ')[1];
    const userData = await verifyToken(token);

    if (!userData) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return Response.json({
      name: 'John Doe', // Replace with actual user data
      email: userData.email
    });

  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}