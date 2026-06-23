import { Suspense } from "react";

import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign in — PostHub",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}