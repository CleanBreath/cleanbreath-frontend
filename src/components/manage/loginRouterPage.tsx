"use client";

import { useRouter } from "next/navigation";
import ManageLoginForm from "./manageLoginForm";
import { use, useEffect } from "react";

interface LoginRouterPageProps {
    token : string | number | undefined;
}

export default function LoginRouterPage({token} : LoginRouterPageProps) {
    const router = useRouter();
    useEffect(() => {
        if(token) {
            router.push("/dashboard")
        }
    }, [token])

    return (
        <ManageLoginForm />
    )
}