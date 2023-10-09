import Image from 'next/image';

export default function HeroImage() {
  return (
    <div className="relative h-full md:h-3/4">
      <div className="h-full flex flex-col items-center justify-center gap-5 bg-cover">
        <div className="flex flex-col gap-6">
          <header className="mx-auto w-[90%] md:w-3/4 text-2xl sm:text-3xl md:text-[2.5rem] text-center">
            <h1 className="text-slate-100 font-black shadow-slate-700 leading-normal [text-shadow:0_2px_2px_var(--tw-shadow-color)]">
              Buy anything you need with just one click
            </h1>
          </header>
          <form className="flex justify-center items-center">
            <input
              type="text"
              className="md:w-1/2 rounded-full py-1.5 px-3 md:py-2 md:px-4 md:text-lg outline-none shadow-md text-green-800"
              placeholder="Search"
            />
          </form>
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background-tiny.jpeg"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="grayscale-[70%]"
        />
        <div className="bg-green-700 opacity-30 absolute inset-0"></div>
      </div>
    </div>
  );
}
