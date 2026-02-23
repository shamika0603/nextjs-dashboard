import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { manrope, inter } from '@/app/ui/fonts';
import Image from 'next/image';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dashboard',
};
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
       <div className={styles.shape} />
       {/*Top Logo Section*/}
      <div className="flex h-20 shrink-0 items-center justify-start rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] p-4 md:h-52">
        <Image
          src="/logo2.png"
          alt="Grace Financial Systems"
          width={200}
          height={80}
          priority
          className="h-auto w-auto max-w-[95%]"
        />
      </div>
      {/*Main Content Section*/}

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/*Left Section - Text*/}

        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/5 md:px-20">
        <p
         className={`${manrope.className} text-2xl font-semibold text-gray-800 md:text-3xl md:leading-normal`}
          >
            Welcome to Grace Financial Systems.
          </p>
        <p
         className={`${inter.className} text-base text-gray-600 md:text-lg md:leading-normal`}
          >
            One stop solution for Grace financial management.
          </p> 
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-[#1E293B] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#334155] md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        
        {/*Right Section - Hero Image*/}
         <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        <Image
          src="/hero-image.png"
          width={800}
          height={560}
          className="object-contain mx-auto rounded-xl shadow-md"
          alt="Grace Financial Systems dashboard mockup"
          priority={false}
        />
        </div>
      </div>
    </main>
  );
}
