import styles from "../../styles/sidebar.module.css";

import LOGO_ICON from "../../public/logo.svg";
import LIST_ICON from "../../public/list.svg";
import ADD_ICON from "../../public/add.svg";
import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import SETTING_ICON from "../../public/setting.svg";
import { testData } from "@/components/testData";
import { useState } from "react";

export default function SideMenu() {
      const [isOpen, setIsOpen] = useState(false);
      const [isListOpen, setIsListOpen] = useState(false);
      const [isAddOpen, setIsAddOpen] = useState(false);
      const [isSettingOpen, setIsSettingOpen] = useState(false);
      const [isSmokeOpen,setIsSmokeOpen] = useState(false);
      const [isNonSmokeOpen,setIsNonSmokeOpen] = useState(false);


      const listToggle = () => {
        setIsListOpen(!isListOpen);
        setIsOpen(!isOpen);
        setIsAddOpen(false);
        setIsSettingOpen(false);
        setIsSmokeOpen(false);
        setIsNonSmokeOpen(false);
      };
      const addToggle = () => {
        setIsListOpen(false);
        setIsOpen(!isOpen);
        setIsAddOpen(!isAddOpen);
        setIsSettingOpen(false);
        setIsSmokeOpen(false);
        setIsNonSmokeOpen(false);
      };
      const settingToggle = () => {
        setIsListOpen(false);
        setIsOpen(!isOpen);
        setIsAddOpen(false);
        setIsSettingOpen(!isSettingOpen);
        setIsSmokeOpen(false);
        setIsNonSmokeOpen(false);
      };
      const smokeToggle = () => {
        setIsListOpen(false);
        setIsOpen(!isOpen);
        setIsAddOpen(false);
        setIsSettingOpen(false);
        setIsSmokeOpen(!isSmokeOpen);
        setIsNonSmokeOpen(false);
      };
      const nonsmokeToggle = () => {
        setIsListOpen(false);
        setIsOpen(!isOpen);
        setIsAddOpen(false);
        setIsSettingOpen(false);
        setIsSmokeOpen(false);
        setIsNonSmokeOpen(isNonSmokeOpen);
      };
    return (
      <div className={isOpen ? styles.sidebarOpen : styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <a href="#">
            <LOGO_ICON />
          </a>
          {isOpen ? <p>CleanBreath</p> : null}
        </div>
        <div className={styles.menu}>
          <div className={styles.listIcon} onClick={listToggle}>
            <LIST_ICON />
          </div>
          <div className={styles.addIcon} onClick={addToggle}>
            <ADD_ICON />
          </div>
          <div className={styles.nonsmokingIcon} onClick={nonsmokeToggle}>
            <NON_SMOKING_ICON />
          </div>
          <div className={styles.smokingIcon} onClick={smokeToggle}>
            <SMOKING_ICON />
          </div>
          <div className={styles.settingIcon} onClick={settingToggle}>
            <SETTING_ICON />
          </div>
        </div>
        {/* 리스트 View */}
        {isListOpen ? (
          <div className={styles.list}>
            {testData.map((item) => (
              <div key={item.address_idx} className={styles.listdata}>
                <div>
                  <p>{item.address_idx}</p>
                </div>
                <div>
                  <p>{item.address_name}</p>
                </div>
                <div>
                  <p>{item.smoking}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/* 추가 View */}
      </div>
    );
}
