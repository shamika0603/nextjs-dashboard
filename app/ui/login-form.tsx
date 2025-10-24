'use client';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-3" aria-label="Login form">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-6 pt-8 shadow-sm">
        <h1
          className={`${lusitana.className} mb-4 text-2xl text-gray-900`}
          aria-label="Please log in to continue"
        >
          Please log in to continue.
        </h1>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium text-gray-900"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-[#0077C8]"
              aria-required="true"
            />
            <AtSymbolIcon
              className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mt-4">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-medium text-gray-900"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              minLength={6}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus:outline-[#0077C8]"
              aria-required="true"
            />
            <KeyIcon
              className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Hidden redirect */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Single Log in button */}
        <Button
          type="submit"
          className="mt-6 w-full"
          aria-disabled={isPending}
          aria-label="Log in to your account"
        >
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
        </Button>

        {/* Error message */}
        <div
          className="flex h-8 items-end space-x-1 mt-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
