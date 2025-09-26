import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Admin credentials - in production, these should be in environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'PISTA@7101';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JAIPAL@7101';

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session token (simple implementation)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // Set HTTP-only cookie with the token
      const response = NextResponse.json({ success: true, message: 'Login successful' });
      
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}