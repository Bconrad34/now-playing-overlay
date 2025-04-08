import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";

const scope = "user-read-currently-playing user-read-playback-state";

interface Token extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
      authorization: { params: { scope } }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token as Token;
    },
    async session({ session, token }) {
      const tokenTyped = token as Token;
      session.accessToken = tokenTyped.accessToken;
      
      // Ensure user has an ID (use sub from OAuth)
      if (tokenTyped.sub && session.user) {
        session.user.id = tokenTyped.sub;
      }
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);