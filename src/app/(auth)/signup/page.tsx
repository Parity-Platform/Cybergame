import { Suspense } from "react";
import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="card p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="text-muted text-sm mt-1">
        7-day free trial on every plan. No charge today.
      </p>
      <Suspense fallback={<div className="mt-6 text-muted text-sm">Loading...</div>}>
        <SignupForm />
      </Suspense>
      <div className="text-sm text-muted mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-white underline underline-offset-4">
          Log in
        </Link>
      </div>
    </div>
  );
}
