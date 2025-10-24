import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
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
      <div className="flex h-20 shrink-0 items-center justify-center rounded-lg bg-[#0077C8] p-4 md:h-52">
        <Image
          src="/logo.png"
          alt="Grace Printing & Mailing"
          width={280}
          height={80}
          priority
          className="h-auto w-auto max-w-[90%]"
        />
      </div>
      {/*Main Content Section*/}

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/*Left Section - Text*/}
        
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
        <p 
         className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to Grace Printing & Mailing.</strong> This is an invoice management dashboard built with Next.js.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-[#0077C8] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#005FA3] md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        
        {/*Right Section - Hero Image*/}
         <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        <Image
          src="/desktop_image.png"
          width={1000}
          height={760}
          className="object-contain mx-auto rounded-xl shadow-md"
          alt="Grace Printing & Mailing dashboard mockup"
          priority={false}
        />
        </div>
      </div>
    </main>
  );
}
