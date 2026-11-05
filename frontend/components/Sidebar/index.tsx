'use client';
import React, { type ReactNode, useEffect, useState } from 'react';
import {
  FaBookOpen,
  FaGraduationCap,
  FaLink,
  FaUserGraduate,
  FaWhatsapp,
} from 'react-icons/fa6';
import { BsCalendar2WeekFill } from 'react-icons/bs';
import { BsCalculatorFill } from 'react-icons/bs';
import { FiGithub } from 'react-icons/fi';
import { MdHelpOutline } from 'react-icons/md';
import dynamic from 'next/dynamic';
import Link from './SidebarLink';

// import { IoLibrarySharp } from "react-icons/io5";
import InstallButton from './Buttons/InstallButton';
import Popup from './Popup';
import { useGestures } from '@/hooks/useGesture';

const MiniButtons = dynamic(
  () => import('./Buttons/MiniButtons').then((a) => a.default),
  { ssr: true }
);

const OpenButton = dynamic(
  () => import('./Buttons/OpenButton').then((a) => a.default),
  { ssr: false }
);
import ThemeToggle from '@/components/themes/ThemeToggle';
import { IoLibrarySharp } from 'react-icons/io5';

export function Sidebar({
  dayorder,
  mini,
  profile,
}: {
  dayorder: ReactNode;
  mini: ReactNode;
  profile?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useGestures({
    onSwipeLeft: () => {
      setIsOpen(false);
    },
    onSwipeRight: () => {
      setIsOpen(true);
    },
  });
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const sidebarWidth = isMobile ? '0px' : isOpen ? '310px' : '60px';
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
  }, [isOpen]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) setIsOpen(false);

    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      setIsOpen(!isMobile);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleClick() {
    const isMobile = window.innerWidth <= 1024;
    setIsOpen(!isMobile);
  }

  return (
    <>
      <header
        className={`fixed left-0 top-0 flex h-full transform flex-col justify-between bg-light-background-normal p-4 text-white transition-all md:duration-150 dark:bg-dark-background-normal ${isOpen ? 'translate-x-0' : '-translate-x-96 lg:-translate-x-56'
          } w-[310px] p-8`}
      >
        <div className='flex flex-col gap-2'>
          <div
            className={`transition duration-150 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='text-color flex items-center justify-between text-light-color dark:text-dark-color'>
              <h1 className='text-3xl font-semibold'>ClassPro</h1>
              <ThemeToggle />
            </div>
            <div className='my-4 flex'>{dayorder}</div>
          </div>
          {!isOpen && mini}

          <hr className='border-t-light-side dark:border-t-dark-side' />

          <div className='text-md flex flex-col gap-2 font-semibold text-light-color dark:text-dark-color'>
            <Link onClick={handleClick} href='/academia'>
              <FaBookOpen className='text-xl' />
              Home
            </Link>

            <Link onClick={handleClick} href='/academia/courses'>
              <FaGraduationCap className='text-xl' />
              Course list
            </Link>

            <Link onClick={handleClick} href='/academia/calendar'>
              <BsCalendar2WeekFill className='text-xl' />
              Calendar
            </Link>

            <hr className='border-t-light-side dark:border-t-dark-side' />

            <Link onClick={handleClick} href='/academia/links'>
              <FaLink className='text-xl' />
              Links
            </Link>
            <Link onClick={handleClick} href='/academia/faculties'>
              <FaUserGraduate className='text-xl' />
              Faculties
            </Link>

          </div>

          <hr className='border-t-light-side dark:border-t-dark-side' />
          <Link title='Grade calculator' href='/academia/gradex' onClick={handleClick}>
            <BsCalculatorFill className='text-xl' />
            GradeX
          </Link>
          <Link title="Question papers" href="/academia/library" onClick={handleClick}>
            <IoLibrarySharp className="text-xl" />
            <span className="flex items-center justify-start gap-3 text-light-color dark:text-dark-color">
              Library{" "}
              <span className="text-xs px-1 rounded-md bg-light-accent dark:bg-dark-accent text-light-background-light dark:text-dark-background-dark py-0.5">
                NEW
              </span>
            </span>
          </Link>
        </div>

        <div className='flex flex-col-reverse gap-4'>
          <div className='flex items-center gap-2 text-light-color dark:text-dark-color'>
            <h4 className='font-mono text-xs opacity-60 transition duration-150'>
              Community:{' '}
            </h4>
            <MiniButtons icon={<FiGithub />} href='/github' />
            <MiniButtons icon={<FaWhatsapp />} href='/whatsapp' />
          </div>
          {profile}
        </div>
        <InstallButton anchor={isOpen} ref={null} />
        <OpenButton
          anchor={isOpen}
          isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        />
        {!isOpen && (
          <MiniButtons
            className='fixed bottom-8 right-9 hidden lg:block'
            icon={<MdHelpOutline />}
            href='https://chat.whatsapp.com/IiKvVzwV142I11Ytqn9RF9'
          />
        )}
      </header>

      <Popup />

      <OpenButton
        mobile
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <div id='dialog-root' />
    </>
  );
  
}

// const GradeXIcon = ({
// 	size = 24, // Default size
// 	color = "currentColor", // Default color
// 	className = "", // Tailwind class support
// 	...props
// }: SVGProps<SVGSVGElement> & { className?: string; size?: number }) => (
// 	<svg
// 		xmlns="http://www.w3.org/2000/svg"
// 		viewBox="0 0 1024 1024"
// 		width={size}
// 		height={size}
// 		className={className} // Apply Tailwind classes
// 		{...props}
// 	>
// 		<title>GradeX</title>
// 		<path
// 			fill="currentColor"
// 			d="M791.893 31.725c40.221 34.564 58.102 85.266 62.419 137.087C859.367 239.278 842.431 321.324 798 378l-2.359 3.156C788.719 390.394 781.175 398.838 773 407l-1.859 2c-25.71 27.197-64.904 45.676-102.348 47.124-42.246.915-79.739-7.492-111.132-37.365C551.44 412.648 546.05 406.099 541 399l-1.271-1.763c-10.917-15.276-19.021-31.967-25.975-49.361a240.467 240.467 0 0 0-1.973-4.728C511 341 511 341 511 338h-2l-1.172 3.687C487.891 401.36 456.303 461.238 413 507l-1.934 2.062c-23.484 24.33-57.77 42.637-91.976 44.106-31.625.352-58.652-10.328-81.514-32.246C212.743 496.493 198.769 464.206 194 430l-.286-1.931C188.251 386.652 196.797 342.442 209 303l.913-2.984C224.53 252.746 248.244 207.178 277 167l1.661-2.321c6.616-9.202 13.379-18.19 20.812-26.749 2.49-2.888 4.889-5.833 7.277-8.805a117.095 117.095 0 0 1 9.586-10.465c1.737-1.733 3.322-3.543 4.914-5.41a188.99 188.99 0 0 1 20.422-20.262 378.62 378.62 0 0 0 5.594-4.883c7.766-6.867 15.755-13.258 24.101-19.406a206.09 206.09 0 0 0 8.57-6.7c17.865-14.41 37.253-29.152 61.305-27.82 9.58 1.065 17.901 4.246 26.758 7.82 44.94 17.878 103.693-9.046 146.285-24.406 59.079-21.299 125.858-28.912 177.608 14.132Zm-126.448 80.638C622.806 150.864 604.465 217.659 601 273c-1.279 27.002-.318 57.27 17.719 79.078 5.267 5.699 11.779 9.437 19.586 10.125 24.208.442 47.033-12.526 64.695-28.203l1.57-1.371C736.703 304.473 750.893 268.65 756 227l.294-2.369c1-9.286.95-18.615.956-27.944l.002-2.698c-.016-13.522-.419-26.717-3.252-39.989l-.52-2.473C749.464 133.154 743.071 114.241 727 103c-20.568-11.487-44.733-5.383-61.555 9.363ZM546 130l-2.203 1.023c-12.058 5.349-23.796 6.302-36.797 6.977l1.102 1.914C516.349 154.591 520.68 168.595 524 185c2.236-.842 2.236-.842 2.942-3.338l.976-3.103 1.102-3.437 1.167-3.685c4.276-13.16 8.755-26.006 16.063-37.835L547 132l-1-2Zm-180 54c-3.049 3.628-5.909 7.386-8.697 11.217-1.444 1.976-2.912 3.931-4.381 5.888C344.84 211.973 337.744 223.263 331 235l-1.332 2.296C306.523 277.338 290.705 321.216 284 367l-.317 2.162c-2.854 22.153-3.227 49.398 10.317 68.338 4.782 5.892 10.491 10.053 18.062 11.437C327.693 450.17 342.603 438.283 354 429c4.121-3.54 8.064-7.257 12-11l2.332-2.102c45.785-42.732 65.851-128.674 67.949-188.589.513-24.342-.981-54.606-17.754-73.934-2.717-2.446-4.771-3.306-8.433-3.641-17.483 1.501-33.425 21.99-44.094 34.266Z"
// 			style={{
// 				fillOpacity: 1,
// 			}}
// 		/>
// 		<path
// 			fill="currentColor"
// 			d="M258.195 27.297c8.959 6.508 12.648 19.487 14.371 29.867 5.002 44.252-19.4 87.904-38.695 126.121C201.965 246.541 181.797 315.947 167 385l-.553 2.58c-8.963 42.017-15.869 84.389-21.885 126.92l-.508 3.569c-3.348 23.637-5.304 47.01-6.054 70.869-2.545 80.818-2.545 80.818-23.078 102.351-9.19 8.181-20.345 11.193-32.547 10.711-10.262-1.198-18.4-4.827-25.41-12.484-7.542-9.656-11.49-20.966-13.653-32.891l-.362-1.997c-3.858-23.193-2.478-47.37.05-70.628l.358-3.385c2.405-22.184 6.126-44.128 9.87-66.118a4054.081 4054.081 0 0 0 4.724-28.516l1.374-8.428c11.94-73.231 24.023-146.619 41.658-218.741l.885-3.624a689.63 689.63 0 0 1 1.595-6.333l.673-2.675.584-2.259c.457-2.136.457-2.136-.721-4.921l-1.87.579c-59.65 18.324-59.65 18.324-84.978 4.913C11.168 240.703 7.242 236.272 4 230l-1.028-1.977c-3.602-8.6-3.599-20.829-.347-29.523 2.318-4.807 5.19-9.225 8.375-13.5l1.332-1.801C16.787 177.614 22.366 173.338 28 169l2.98-2.305c12.11-8.997 25.349-16.187 38.437-23.641C86.782 133.159 103.001 123.271 118 110l2.09-1.827c7.249-6.415 14.134-13.177 20.987-20.01 1.978-1.969 3.967-3.926 5.956-5.884 10.191-10.104 18.556-20.611 26.029-32.904 9.479-15.24 18.886-27.836 36.862-32.92 17.261-3.79 33.632 2.194 48.271 10.842ZM678.187 499.688l3.077-.03c2.926-.023 5.852-.026 8.779-.021l2.639-.028c7.26.054 13.777 1.066 19.255 6.079 4.696 7.541 4.753 15.632 4.063 24.312-3.221 11.558-13.506 18.335-23.426 23.934-28.45 15.207-61.308 21.759-92.351 29.628-16.124 4.092-32.12 8.578-48.116 13.139-10.1 2.874-20.219 5.678-30.337 8.483l-10.256 2.846c-9.687 2.69-19.375 5.379-29.065 8.059C431.375 630.214 380.452 644.774 330 661l-2.25.723c-15.63 5.044-30.842 10.853-45.985 17.185C260.979 687.6 239.879 695.5 218 701l-2.071.535c-8.616 2.157-16.957 2.751-25.804 2.84l-2.883.042c-10.163-.069-18.744-2.32-26.242-9.417-7.87-8.362-8.539-18.693-8.488-29.668.213-6.799 1.295-11.827 5.488-17.332l1.586-2.238c21.049-26.61 65.313-35.881 95.854-46.17l2.833-.955 2.81-.947c7.986-2.698 15.924-5.521 23.854-8.377 44.083-15.781 89.16-28.426 134.177-41.217 7.147-2.031 14.291-4.069 21.434-6.114C501.629 524.496 562.654 508.514 626 502l3.416-.359c16.236-1.637 32.467-1.865 48.771-1.953ZM812.625 566.75l3.695-.023c22.126.047 22.126.047 28.68 6.273 5.412 8.355 5.76 17.253 5 27-2.207 8.963-8.535 15.567-16 20.625-18.959 11.309-41.794 15.656-63.001 20.884-9.054 2.232-18.08 4.537-27.061 7.053l-2.654.741c-7.675 2.176-15.297 4.523-22.926 6.854-10.494 3.2-21.015 6.305-31.538 9.407-39.273 11.589-78.423 23.555-117.489 35.823a6966.766 6966.766 0 0 1-17.866 5.582c-19.694 6.132-39.285 12.54-58.826 19.14-2.807.948-5.614 1.893-8.421 2.838-84.607 28.497-168.234 59.655-250.164 95.164-2.006.868-4.013 1.733-6.02 2.597-16.416 7.066-32.699 14.39-48.909 21.917l-2.665 1.237a4114.18 4114.18 0 0 0-25.003 11.7C137.581 868.098 123.564 874.14 109 879l-3.064 1.083c-5.208 1.453-10.563 1.282-15.932 1.323l-3.477.035c-2.42.019-4.84.032-7.26.039-3.69.02-7.376.082-11.066.145-2.357.013-4.714.024-7.072.031l-3.321.075c-7.342-.042-11.57-1.524-16.808-6.731-7.622-8.61-9.691-21.541-9.21-32.742.827-8.857 3.647-14.279 9.21-21.258l1.746-2.246C57.225 801.286 79.456 789.742 99 779l2.654-1.46C150.038 751.14 202.534 732.333 254 713l2.771-1.041A2916.362 2916.362 0 0 1 292 699l2.691-.971c63.178-22.766 126.971-43.839 191.818-61.354 3.307-.896 6.61-1.805 9.913-2.714 44.888-12.339 90.222-22.923 135.571-33.411 7.113-1.646 14.224-3.3 21.332-4.966 42.645-9.991 85.355-19.444 128.638-26.26 1.925-.306 3.849-.625 5.772-.944 8.336-1.314 16.458-1.684 24.89-1.63Z"
// 			style={{
// 				fillOpacity: 1,
// 			}}
// 		/>
// 	</svg>
// );
