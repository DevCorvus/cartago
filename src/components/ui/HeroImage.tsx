import Image from 'next/image';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

export default function HeroImage() {
  return (
    <div className="h-full flex relative ">
        <button type="button" className='h-full bg-zinc-50 bg-opacity-40 z-10 absolute left-0 text-4xl text-lime-950' >
          <HiOutlineChevronLeft/>
        </button>
        <Image
          src="/background-tiny.jpeg"
          alt="Hero Image"
          fill={true}
          object-fit="cover"
          className="h-screen  grayscale-[70%]"
        />
        <button type="button" className='h-full bg-zinc-50 bg-opacity-40 z-10 absolute right-0 text-4xl text-lime-950'>
          <HiOutlineChevronRight/>
        </button>
      </div>
  );
}
