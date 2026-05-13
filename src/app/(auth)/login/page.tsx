import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="card p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-muted text-sm mt-1">Log in to your account.</p>
      <Suspense fallback={<div className="mt-6 text-muted text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
      <div className="text-sm text-muted mt-6 text-center">
        New here?{" "}
        <Link href="/signup" className="text-white underline underline-offset-4">
          Create an account
        </Link>
      </div>
    </div>
  );
}
