// src/services/auth.service.ts
import { sendRequest } from '@/utils/api';

export const registerAccount = async (
    name: string,
    email: string,
    password: string
): Promise<IBackendRes<any>> => {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        method: "POST",
        body: { email, password, name }
    });
}; 