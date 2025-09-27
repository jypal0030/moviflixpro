import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - MoviFlixPro",
  description: "Manage your MoviFlixPro content and settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}