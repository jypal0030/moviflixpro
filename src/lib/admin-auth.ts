import { NextRequest, NextResponse } from 'next/server';

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  return !!token; // Simple check - in production, you'd validate the token
}

export function requireAdminAuth(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return null;
}