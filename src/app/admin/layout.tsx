'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');
      
      // If on login page, don't redirect
      if (pathname === '/admin/login') {
        return;
      }
      
      // If no token or user, redirect to login
      if (!token || !user) {
        router.push('/admin/login');
        return;
      }
      
      // Validate user data
      try {
        const parsedUser = JSON.parse(user);
        if (!parsedUser.username || !parsedUser.role) {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        // Invalid user data, clear storage and redirect
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}