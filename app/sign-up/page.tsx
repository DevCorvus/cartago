import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <h1>Sign up</h1>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="name" />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <select name="location" id="location">
            <option value="peru">Peru</option>
            <option value="venezuela">Venezuela</option>
            <option value="colombia">Colombia</option>
            <option value="Brasil">Brasil</option>
          </select>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" placeholder="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="password" />
        </div>
        <div>
          <label htmlFor="confirmPassword">Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="confirm password"
          />
        </div>
        <button type="submit">Sing Up</button>
      </form>
      <p>
        Do you already have an account? <Link href="sign-in">Sing In</Link>
      </p>
    </>
  );
}
