import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    console.log('Password change attempt');

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get the current admin user (for now, we'll use the first admin user)
    // In production, you would get the current user from the session/token
    const adminUser = await db.adminUser.findFirst();
    
    if (!adminUser) {
      return NextResponse.json(
        { message: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify current password
    if (adminUser.password !== currentPassword) {
      console.log('Current password is incorrect');
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update the password
    await db.adminUser.update({
      where: { id: adminUser.id },
      data: { password: newPassword }
    });

    console.log('Password updated successfully for user:', adminUser.username);

    // Return success response
    return NextResponse.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}