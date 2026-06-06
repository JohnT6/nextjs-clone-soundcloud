import { withAuth } from "next-auth/middleware"

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
        signIn: "/auth/signin",
        error: "/error",
    },
})

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        "/playlist",
        "/track/upload",
        "/like"
    ],
}