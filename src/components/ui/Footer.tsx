import Link from 'next/link';
import CartagoIcon from './svg/CartagoIcon';
import Image from 'next/image';
import { ImGithub } from 'react-icons/im';

export default function Footer() {
  return (
    <footer className="rounded-t-lg bg-gradient-to-b from-cyan-900 to-cyan-950 px-4 py-6 text-cyan-50">
      <div className="container mx-auto flex flex-wrap justify-between gap-4">
        <header className="flex flex-1 items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 hover:text-cyan-300 focus:text-cyan-300"
          >
            <div className="size-8 flex items-center justify-center rounded-full border-2 border-cyan-50 transition group-hover:border-cyan-300 group-focus:border-cyan-300">
              <CartagoIcon className="w-3.5" />
            </div>
            <span className="text-xl">Cartago</span>
          </Link>
          <p className="text-slate-300/75">eCommerce platform demo</p>
        </header>
        <div className="flex flex-1 justify-around sm:flex-grow-0 sm:justify-normal sm:gap-10">
          <section className="flex items-center gap-3">
            <header className="font-medium">Repo</header>
            <a
              href="https://github.com/DevCorvus/cartago"
              target="_blank"
              className="transition hover:text-cyan-300 focus:text-cyan-300"
            >
              <ImGithub className="text-4xl" />
            </a>
          </section>
          <section className="flex items-center gap-3">
            <header className="font-medium">Team</header>
            <ul className="flex gap-4">
              <li className="flex items-center">
                <a
                  href="https://github.com/DevCorvus"
                  target="_blank"
                  className="size-10 relative inline-block rounded-full outline outline-cyan-500 transition hover:outline-cyan-300 focus:outline-cyan-300"
                >
                  <Image
                    fill={true}
                    sizes="50px"
                    src="https://github.com/DevCorvus.png"
                    alt="DevCorvus profile"
                    className="rounded-full"
                  />
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="https://github.com/Lachicagladiadora"
                  target="_blank"
                  className="size-10 relative inline-block rounded-full outline outline-cyan-500 transition hover:outline-cyan-300 focus:outline-cyan-300"
                >
                  <Image
                    fill={true}
                    sizes="50px"
                    src="https://github.com/Lachicagladiadora.png"
                    alt="Lachicagladiadora profile"
                    className="rounded-full"
                  />
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </footer>
  );
}
