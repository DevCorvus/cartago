import Link from 'next/link';

export default function Login() {
  return (
    <div className="bg-lime-50 w-full h-full flex items-center justify-center text-green-800">
      <div className="flex flex-col gap-12">
        <form className="flex items-center justify-center flex-col gap-10">
          <header className="w-full ">
            <h1 className=" text-2xl font-bold">Sign In</h1>
          </header>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="email" className="opacity-50">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Write your email"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
            </div>
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="password" className="opacity-50">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Write your password"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Log In
          </button>
        </form>
        <div className="flex items-center justify-center flex-col text-sm opacity-75">
          <p>
            You do not have an account?
            <Link
              href="sign-up"
              className="hover:text-lime-700 transition font-semibold"
            >
              {' '}
              Sign up here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
