"use client";

import { useEffect, useState } from "react";
import Manage from "./manage";
import { useRouter } from "next/navigation";
import { on } from "events";

interface ManageRouterPageProps {
    token : string | number | undefined;
}

export default function ManageRouterPage({token} : ManageRouterPageProps) {
    const router = useRouter();
    useEffect(() => {
        if(!token) {
            router.push("/login")
        }
    }, [token, router])


    return (
        <Manage/>
    )
}