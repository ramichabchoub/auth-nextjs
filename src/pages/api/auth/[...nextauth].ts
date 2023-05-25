import NextAuth, { Account, Profile, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import FacebookProvider from 'next-auth/providers/facebook'
// import TwitterProvider from 'next-auth/providers/twitter'
import Auth0Provider from 'next-auth/providers/auth0'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { JWT } from 'next-auth/jwt'
import { Adapter } from 'next-auth/adapters'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID as string,
    //   clientSecret: process.env.TWITTER_SECRET as string,
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID as string,
      clientSecret: process.env.AUTH0_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
    // Passwordless / email sign in
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT
      user?: User | Adapter | null
      account?: Account | null
      profile?: Profile | null
    }) {
      if (user) {
        token.provider = account?.provider as string
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.provider = token.provider
      }
      return session
    },
  },
})
