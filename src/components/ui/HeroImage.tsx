import Image from 'next/image';

export default function HeroImage() {
  return (
    <div className="relative z-10 h-full">
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-cover">
        <div className="flex flex-col gap-6">
          <header className="mx-auto w-[90%] text-center text-2xl sm:text-3xl md:w-3/4 md:text-[2.5rem]">
            <h1 className="font-black leading-normal text-slate-100 shadow-slate-700 [text-shadow:0_2px_2px_var(--tw-shadow-color)]">
              Buy anything you need with just one click
            </h1>
          </header>
          <form className="flex items-center justify-center">
            <input
              type="text"
              className="rounded-full px-3 py-1.5 text-green-800 shadow-md outline-none md:w-1/2 md:px-4 md:py-2 md:text-lg"
              placeholder="Search"
            />
          </form>
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background-tiny.jpeg"
          alt="Hero Image"
          fill={true}
          object-fit="cover"
          className="grayscale-[70%]"
        />
        <div className="absolute inset-0 bg-green-700 opacity-30"></div>
      </div>
    </div>
  );
}
