'use client';

import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session, update } = useSession();

  async function updateSession() {
    if (session)
      await update({
        ...session,
        user: {
          ...session.user,
          organizationId: 'something else',
        },
      });
  }

  function logInSession() {
    console.log({ session });
  }

  return (
    <div className="flex flex-wrap gap-5">
      <button
        className="border bg-violet-600 text-white rounded px-4 py-4"
        onClick={() => logInSession()}
      >
        log session
      </button>
      <button
        className="border bg-violet-600 text-white rounded px-4 py-4"
        onClick={updateSession}
      >
        update session
      </button>
    </div>
  );
}
