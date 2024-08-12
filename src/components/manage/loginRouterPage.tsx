"use client";

import { useRouter } from "next/navigation";
import ManageLoginForm from "./manageLoginForm";
import { use, useEffect } from "react";

interface LoginRouterPageProps {
    token : string | number | undefined;
}

export default function LoginRouterPage({token} : LoginRouterPageProps) {
    useEffect(() => {
        if(token) {
            window.location.href = "/dashboard";
        }
    }, [token])

    console.log(token);

    return (
        <ManageLoginForm />
    )
}