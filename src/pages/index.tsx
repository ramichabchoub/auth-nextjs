/* eslint-disable @next/next/no-img-element */
import { NextPageContext } from 'next'
import { getSession, useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  console.log('user session:', session)

  return (
    <>
      <h1>Welcome Home!</h1>
      {session ? (
        <>
          <h2 className="text-3xl font-bold underline">{session.user?.name}</h2>
          <img
            src={session?.user?.image!}
            alt={session?.user?.name!}
            className="h-32 w-32 rounded-full"
          />
          <h2 className="text-3xl font-bold underline">
            {session.user?.email}
          </h2>
          <span className="flex">Provider: {session.user?.provider}</span>
          <button onClick={() => signOut()} className="bg-blue-500">
            Sign out
          </button>
        </>
      ) : (
        <button onClick={() => signIn()} className="bg-blue-500">
          Sign in
        </button>
      )}
    </>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx)
  return {
    props: {
      session,
    },
  }
}
