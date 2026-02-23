import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Image from 'next/image';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1E293B] to-[#334155] px-3 py-4 text-slate-100 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md border border-[#334155] bg-gradient-to-r from-[#1E293B] to-[#334155] p-4 transition-colors hover:from-[#334155] hover:to-[#1E293B] md:h-40"
        href="/"
      >
        <div className="w-64 text-white md:w-48">
          <Image
              src="/logo2.png"
              alt="Grace Financial Systems"
              width={900}
              height={200}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-[#334155] opacity-40 md:block"></div>
        <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md border border-transparent bg-transparent p-3 text-sm font-medium text-slate-100 transition-colors hover:border-[#334155] hover:bg-[#334155] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
