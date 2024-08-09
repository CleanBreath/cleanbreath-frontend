import React, { useState, useMemo } from "react";
import styles from "../../styles/sidebar.module.css";
import LOGO_ICON from "../../public/logo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import SETTING_ICON from "../../public/setting.svg";
import NOTICE_ICON from "../../public/Notice.svg";
import { AddressData } from "./listData";
import SettingArea from "@/components/settingArea";
import AddComponent from "./addComponent";
import NoticeList from "@/components/noticeList";

interface SideMenuProps {
  onListClick: (item: AddressData) => void;
  activeMenu : string | null;
  setActiveMenu : (menu : string | null) => void;
  isData: AddressData[];
  isLoading: boolean;
  error: string | null;
}

const SideMenu = ({
  onListClick,
  isData,
  isLoading,
  activeMenu,
  setActiveMenu,
  error,
}: SideMenuProps) => {
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 검색어에 따라 필터링된 데이터
  const filteredData = useMemo(() => {
    if (searchTerm.trim() === "") {
      return isData;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return isData.filter(item =>
      item.address_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, isData]);

  return (
    <div className={activeMenu ? styles.sidebarOpen : styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="#">
          <LOGO_ICON />
        </a>
        {activeMenu ? <p>CleanBreath</p> : null}
      </div>
      <div className={styles.menu}>
        <div
          className={activeMenu === 'list' ? styles.listIconOpen : styles.listIcon}
          onClick={() => setActiveMenu("list")}
        >
          <LIST_ICON />
        </div>
        <div
          className={activeMenu === 'add' ? styles.addIconOpen : styles.addIcon}
          onClick={() => setActiveMenu("add")}
        >
          <ADD_ICON />
        </div>
        <div
          className={activeMenu === 'setting' ? styles.settingIconOpen : styles.settingIcon}
          onClick={() => setActiveMenu("setting")}
        >
          <SETTING_ICON />
        </div>
        <div
          className={activeMenu === 'notice' ? styles.settingIconOpen : styles.settingIcon}
          onClick={() => setActiveMenu("notice")}
        >
          <NOTICE_ICON />
        </div>
      </div>
      {/* 검색창 추가 
      {isListOpen && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="주소 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      */}

      {/* 리스트 View */}
      {activeMenu === 'list' && (
        <div className={styles.list}>
          {isLoading ? (
            <p>데이터 로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.address_idx}
                className={styles.listdata}
                onClick={() => onListClick(item)}
              >
                <p>{item.address_idx}</p>
                <p>{item.address_name}</p>
                {item.smoking === "금연" ? (
                  <NON_SMOKING_ICON />
                ) : (
                  <SMOKING_ICON />
                )}
              </div>
            ))
          ) : (
            <p>리스트가 비어 있습니다.</p>
          )}
        </div>
      )}

      {/* 추가 컴포넌트 */}
      {activeMenu === 'add' && (
        <div className={styles.add}>
          <AddComponent />
        </div>
      )}

      {/* 공지사항 컴포넌트 */}
      {activeMenu === 'notice' && <NoticeList />}

      {/* 설정 컴포넌트 */}
      {activeMenu === 'setting' && <SettingArea />}
    </div>
  );
};

export default SideMenu;