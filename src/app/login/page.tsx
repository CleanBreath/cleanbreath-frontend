"use server";
import LoginRouterPage from "@/components/manage/loginRouterPage";
import ManageLoginForm from "@/components/manage/manageLoginForm";
import axios from "axios";
import { on } from "events";
import { GetServerSideProps } from "next";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default async function ManageLoginPage() {
    // const session = document.cookie;


    return (
        <>
            {/* <LoginRouterPage token={session}/> */}
            개발중
        </>
    )

}