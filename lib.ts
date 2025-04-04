import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server';


const secretKey = 'secret'; // PUT THIS  IN ENV VARIABLES
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('10 sec from now')
  .sign(key);
}

export async function decrypt(input: string): Promise<any> {  
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const user = { email: formData.get('email'), name: 'Al'}; // THIS IS WHERE THE DATABASE QUERY WOULD GO

  // Create the session (AFTER RECEIVING THE USER FROM DATABASE)
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });
}

export const getSession = async () => {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set('session', await encrypt(parsed), {
    httpOnly: true,
    expires: parsed.expires as Date,
  });
  return res;
}



export async function logout() {
  cookies().delete('session')
} 

