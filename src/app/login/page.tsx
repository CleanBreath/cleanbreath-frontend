
import LoginRouterPage from "@/components/manage/loginRouterPage";
import ManageLoginForm from "@/components/manage/manageLoginForm";
import axios from "axios";
import { on } from "events";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageLoginPage() {
    const session = cookies().get("JSESSIONID")?.name;
    return (
        <>
            <LoginRouterPage token={session}/>
        </>
    )

}