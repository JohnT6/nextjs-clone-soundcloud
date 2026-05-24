import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
    secret: process.env.NO_SECRET,

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }