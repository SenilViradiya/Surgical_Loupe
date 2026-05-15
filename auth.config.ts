import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      credentials: {},
      authorize: async () => {
        return null;
      },
    }),
  ],
};