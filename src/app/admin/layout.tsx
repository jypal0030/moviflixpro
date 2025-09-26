import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  // Check if admin is authenticated
  if (!adminSession) {
    redirect('/admin-login');
  }

  return <>{children}</>;
}