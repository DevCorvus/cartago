import Link from 'next/link';

export default function Login() {
  return (
    <>
      <h1>Sing in</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" placeholder="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="password" />
        </div>
        <input type="submit" />
        <button type="submit">Log In</button>
      </form>
      <p>
        You do not have an account?
        <Link href="sign-up">Sign up.</Link>
      </p>
      <p>
        Did you forget your password?
        <a href="https://www.google.com/">Recover it</a>
      </p>
    </>
  );
}
