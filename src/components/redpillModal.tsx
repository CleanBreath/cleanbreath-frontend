import React, { useState, ChangeEvent } from 'react';
import styles from "../../styles/redPillModal.module.css";

type RedPillModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const RedPillModal: React.FC<RedPillModalProps> = ({ isOpen, onClose }) => {
    const [cigaretteCount, setCigaretteCount] = useState<string>('');

    if (!isOpen) return null;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCigaretteCount(e.target.value);
    };

    const handleConfirm = () => {
        // 확인 버튼을 눌렀을 때 처리할 로직을 여기에 추가
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.header}>
                <span>REDPILL</span>
                <img src="" alt="Pill Icon" className={styles.pillIcon} />
            </div>
            <div className={styles.content}>
                <p className={styles.question}>"하루에 몇 개비를 피우시나요?"</p>
                <div className={styles.inputContainer}>
                    <input
                        type="number"
                        value={cigaretteCount}
                        onChange={handleInputChange}
                        placeholder="0"
                    />
                    <label>개비</label>
                </div>
                <button className={styles.confirmButton} onClick={handleConfirm}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default RedPillModal;
