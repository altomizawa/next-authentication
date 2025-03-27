import { redirect } from "next/navigation";
import { getSession, login, logout } from "@/lib";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1>NEXTJS AUTHENTICATION</h1>
       <form 
          className="flex flex-col gap-[16px]"
          action={async (formData) => {
            'use server';
            await login(formData);
            redirect('/');
          }}>
        <input name='email' className="px-2 py-2 border-[1px] rounded-lg" placeholder="email" />
        <button  type="submit" className="px-2 py-1 rounded-lg bg-blue-500 text-white">Login</button>
      </form>
       <form 
          className="flex flex-col gap-[16px]"
          action={async () => {
            'use server';
            await logout();
            redirect('/');
          }}>
        <button type="submit" className="px-2 py-1 rounded-lg bg-red-500 text-white">Logout</button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      </main>
    </div>
  );
}
