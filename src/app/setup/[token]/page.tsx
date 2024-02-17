import { fetchInvitationToken, fetchUserInvitationToken } from '@/lib/data';
import { useEffect, useState, Suspense } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Preparing from '@/app/preparing/page';
import InvalidToken from '@/app/invalidtoken/page';

//@ts-ignore
import { useFormState } from 'react-dom';
import SetUpAccount from '@/components/SetUpAccount';

export default function Page({ params }: { params: { token: string } }) {
  return (
    <Suspense fallback={<Preparing />}>
      <MiddleMen params={params} />
    </Suspense>
  );
}

export async function MiddleMen({ params }: { params: { token: string } }) {
  const token = await fetchInvitationToken(params.token);

  if (!token) {
    return <InvalidToken />;
  } else {
    return <SetUpAccount params={params} />;
  }
}
