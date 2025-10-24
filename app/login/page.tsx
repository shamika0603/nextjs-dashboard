import Image from 'next/image';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Header */}
        <div className="bg-[#0077C8] p-4 flex justify-center">
          <div className="w-32 text-white md:w-36">
            <Image
              src="/logo.png"
              alt="Grace Printing & Mailing"
              width={240}
              height={60}
              priority
              className="h-auto w-auto"
            />
          </div>
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
