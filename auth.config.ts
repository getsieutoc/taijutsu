import { NextAuthConfig } from 'next-auth';

const authConfig = {
  secret: process.env.AUTH_SECRET!,

  // We do this to avoid bringing bcrypt into the middleware
  providers: [],

  pages: {
    signIn: '/auth',
    verifyRequest: '/auth',
    error: '/auth', // Error code passed in query string as ?error=
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      if (isOnAuth) {
        return !isLoggedIn;
      }

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },

    // NOTE: The `profile` and `user` object is only visible at the login phase for oauth type.
    // On Credentials type, only `account` and `user` object is visible at login
    // How this works: On the first login, the shape of token is really simple { name, email, sub, picture }
    // but we have info inside account (simple form because this is credentials), user (returned from authorize callback)
    // we dont have value in `profile` because it only comes from OAuth like login by Google/Facebook
    jwt: async ({ token, account, user }) => {
      // Only trigger at the login phase. In here, we merge them back.
      if (user && account && account.type === 'credentials') {
        // 'user' is the AuthResponse returned from /auth/login
        // we should make it smaller, let's not use value there
        return {
          ...token,
          user,
        };
      }

      return token;
    },

    // https://github.com/nextauthjs/next-auth/blob/main/docs/docs/guides/03-basics/refresh-token-rotation.md
    // The `token` is the object return from `jwt` callback. The `session.user` object, again, is the default value
    // from the `token` we see inside jwt callback. Because of that, it's good to merge them.
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token.user || {}),
        },
      };
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
