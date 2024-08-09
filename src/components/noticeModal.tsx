import React from "react";
import LOGO_ICON from "../../public/logo.svg";
import styles from "../../styles/noticeModal.module.css";

type NoticeModalProps = {
    title: string;
    content: string;
    updateAt: string;
    onClose: () => void;
};

export default function NoticeModal({ title, content, updateAt, onClose }: NoticeModalProps) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <LOGO_ICON className={styles.logoIcon} />
                    <h1 className={styles.cleanBreath}>CleanBreath</h1>
                    <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <h2 className={styles.modalTitle}>
                    공지사항: <span className={styles.highlightGreen}>{title}</span>
                </h2>
                <div className={styles.modalBody}>
                    <p>{content}</p>
                </div>
                <div className={styles.modalBottom}>
                    <p>{new Date(updateAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
