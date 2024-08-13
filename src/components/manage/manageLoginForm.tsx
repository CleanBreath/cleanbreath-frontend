"use client";

import UserEmail from "../../../public/UserEmail.svg";
import UserPassword from "../../../public/Password.svg";
import BackIcon from "../../../public/back.svg";
import styles from "../../../styles/manageCss/manageLoginForm.module.css";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";


export default function ManageLoginForm() {
  const router = useRouter();
  const onMainPage = () => {
      router.push("/");
  };

  const MANAGE_API_URL =
    "https://server.bluesky-cleanbreath.com/v1/manage/login";
  const MANAGE_API_URL_DEV = "http://localhost:7001/v1/manage/login";

  const [email, setEmail] = useState<string | number | undefined>("");
  const [password, setPassword] = useState<string | number | undefined>("");

  const onLogin = async() => {
    try {
      const response = await axios.post(
        MANAGE_API_URL,
        { email, password },
        { withCredentials: true }
      );  

      sessionStorage.setItem("ManageName", response.data.name);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert("로그인 실패");
    } finally {
      alert("로그인 성공");
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <div className={styles.back} onClick={onMainPage}>
        <BackIcon />
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Clean Breath</h1>
        </div>
          <div className={styles.userEmail}>
            <UserEmail />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.userPassword}>
            <UserPassword />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        <div className={styles.LoginBtn}>
          <button onClick={onLogin}>로그인</button>
        </div>
      </div>
    </>
  );
}
