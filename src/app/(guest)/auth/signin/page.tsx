import AuthSignin from "@/components/auth/auth.signin"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const SigninPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        //redirect to home page
        redirect('/')
    }
    return (
        <AuthSignin />
    )
}

export default SigninPage