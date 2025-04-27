'use server'

import { auth, signIn } from "@/auth";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "./api";


export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        console.log(">>> check r: ", r)
        return r;
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }

        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal server error",
                code: 0
            }
        }

    }
}

export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-users")
    return res;
}

// Restaurant Actions
export const getRestaurantsWithPagination = async (page: number, limit: number) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants?current=${page}&pageSize=${limit}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        next: { tags: ['restaurants'] }
    });
    return res;
}

export const handleCreateRestaurantAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    });
    revalidateTag("restaurants")
    return res;
}

export const handleUpdateRestaurantAction = async (data: any) => {
    const session = await auth();

    const formData = new URLSearchParams();

    // Format data as array with single object
    formData.append('0[_id]', data._id);
    formData.append('0[name]', data.name);
    formData.append('0[email]', data.email);
    formData.append('0[phone]', data.phone);
    formData.append('0[address]', data.address);
    formData.append('0[rating]', data.rating?.toString() || '');

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    revalidateTag("restaurants")
    return res;
}

export const handleDeleteRestaurantAction = async (id: string) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        }
    });
    revalidateTag("restaurants")
    return res;
}

// Menu Actions
export const handleCreateMenuAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    });
    revalidateTag("list-menus");
    return res;
};

export const handleUpdateMenuAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    });
    revalidateTag("list-menus");
    return res;
};

export const handleDeleteMenuAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    });
    revalidateTag("list-menus");
    return res;
};
