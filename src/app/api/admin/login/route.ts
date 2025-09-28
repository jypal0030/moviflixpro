import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Login attempt for username:', username);

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against database
    const adminUser = await db.adminUser.findFirst({
      where: {
        username: username
      }
    });

    if (!adminUser || adminUser.password !== password) {
      console.log('Invalid credentials for username:', username);
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('Credentials valid, generating token');
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    // Create admin user object
    const userResponse = {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      createdAt: adminUser.createdAt
    };

    console.log('Generated token:', token);
    console.log('Admin user object:', userResponse);

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}