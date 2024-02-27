import { auth } from '../../../auth';
import { useRouter } from 'next/navigation';
import { signOut } from '../../../auth';
import Image from 'next/image';
import React from 'react';
// import { signOut } from 'next-auth/react'


export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className='flex items-center gap-8'>
      <div>

      </div>
      <div className='mt-8'>
        <p className='mb-3'>Email: {user?.email}</p>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button>
             Log Out
          </button>
        </form>

      </div>
    </div>
  );
}
