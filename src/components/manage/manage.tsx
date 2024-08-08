"use client";
import { useEffect, useState } from "react";
import styles from "../../../styles/manageCss/manageDashBoard.module.css";
import LOGO_ICON from "../../../public/logo.svg";
import USER from "../.././../public/user_icon.svg";
import axios from "axios";

export default function Manage() {
    const MANAGE_API_URL = "https://server.bluesky-cleanbreath.com/v1/manage/logout";
    const MANAGE_API_URL_DEV = "http://localhost:7001/v1/manage/logout";

    const [name, setName] = useState<string | null>('');
    const [activeMenu, setActiveMenu] = useState<string | null>('feedback');

    const toggleMenu = (menu: string | null) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    }

    const logout = async() => {
        try {
            const response = await axios.get(
                MANAGE_API_URL_DEV,
                { withCredentials: true }
            );
            sessionStorage.removeItem("ManageName");

            console.log(response);
            alert("로그아웃 성공");
        } catch (err) {
            console.error(err);
        } finally{
            window.location.href = "/login";
        }
    }


    useEffect(() => {
        setName(sessionStorage.getItem("ManageName"));
    }, [name]);
    
    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <LOGO_ICON className={styles.logo} />
              <h1>CleanBreath</h1>
            </div>
            <div>
                <USER />
                <h3>{name}</h3>
                <button onClick={logout}>로그아웃</button>
            </div>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.menu}>
                <div 
                    className={activeMenu === 'feedback' ? styles.selected : undefined}
                    onClick={() => toggleMenu('feedback')}
                >
                    피드백 현황
                </div>
                <div 
                    className={activeMenu === 'smokingArea' ? styles.selected : undefined}
                    onClick={() => toggleMenu('smokingArea')}
                >
                    흡연구역 요청
                </div>
                <div
                    className={activeMenu === 'notice' ? styles.selected : undefined}
                    onClick={() => toggleMenu('notice')}
                >
                    공지사항
                </div>
            </div>
          </div>
          <div className={styles.sections}>

          </div>
        </div>
      </>
    );
}