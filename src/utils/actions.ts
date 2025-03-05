'use server'
import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            email: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if ((error as any).type === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        } else if ((error as any).type === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal server error.",
                code: 0
            }
        }

    }
}