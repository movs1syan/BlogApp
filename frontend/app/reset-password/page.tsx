import { notFound } from "next/navigation";
import ClientResetPassword from "@/components/pages/ClientResetPassword";

export default async function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const res = await fetch(`http://localhost:8000/api/users/reset-password?token=${token}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  return <ClientResetPassword token={token} />;
}