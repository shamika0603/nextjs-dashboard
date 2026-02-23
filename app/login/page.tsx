import Image from 'next/image';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#334155]">
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Header */}
        <div className="flex justify-center bg-gradient-to-r from-[#1E293B] to-[#334155] p-4 text-center">
          <Image
            src="/logo2.png"
            alt="Grace Financial Systems"
            width={280}
            height={50}
            priority
            className="h-auto w-auto inline-block"
          />
        </div>

        {/* Form */}
        <div className="p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
