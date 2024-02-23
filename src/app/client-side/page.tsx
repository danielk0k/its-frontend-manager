'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Profile() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    },
  });

  const user = data?.user;

  return (
    <>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className='flex items-center gap-8'>
          <div>
            <Image
              src={user.image ? user.image : '/images/default.png'}
              alt={`profile photo of ${user.name}`}
              width={90}
              height={90}
            />
          </div>
          <div className='mt-8'>
            <p className='mb-3'>ID: {user.id}</p>
            <p className='mb-3'>Name: {user.name}</p>
            <p className='mb-3'>Email: {user.email}</p>
          </div>
        </div>
      )}
    </>
  );
}
