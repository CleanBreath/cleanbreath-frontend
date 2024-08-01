import React, { useState, ChangeEvent } from 'react';
import styles from "../../styles/redPillModal.module.css";

type RedPillModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const RedPillModal: React.FC<RedPillModalProps> = ({ isOpen, onClose }) => {
    const [cigaretteCount, setCigaretteCount] = useState<string>('');
    const [showResult, setShowResult] = useState<boolean>(false);
    const [totalCost, setTotalCost] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCigaretteCount(e.target.value);
    };

    const handleConfirm = () => {
        const count = parseInt(cigaretteCount, 10);
        if (!isNaN(count)) {
            const cost = count * 4500 * 365;
            setTotalCost(cost);
            setShowResult(true);
        }
    };

    const handleCloseResult = () => {
        setShowResult(false);
        onClose();
    };

    return (
        <>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.redpill}>REDPILL</span>
                    <img src="logo.svg" alt="Pill Icon" className={styles.pillIcon} />
                </div>
                <div className={styles.content}>
                    <p className={styles.question}>"하루에 몇 갑을 피우시나요?"</p>
                    <div className={styles.inputContainer}>
                        <input
                            type="number"
                            value={cigaretteCount}
                            onChange={handleInputChange}
                            placeholder="0"
                        />
                        <label>갑</label>
                    </div>
                    <button className={styles.confirmButton} onClick={handleConfirm}>
                        확인
                    </button>
                </div>
            </div>

            {showResult && (
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <span className={styles.redpill}>REDPILL</span>
                        <img src="logo.svg" alt="Pill Icon" className={styles.pillIcon}/>
                    </div>
                    <div className={styles.content}>
                        <p className={styles.money}>"만약 당신이 담배를 피우지 않았다면,<br/>
                        1년에 약 {totalCost?.toLocaleString()}원 을 절약했을 것입니다."<br/>
                        "당신은 할 수 있습니다! 오늘부터 한번 더 금연을 시도해 보세요!"</p>
                        <button className={styles.confirmButton} onClick={handleCloseResult}>
                            금연하기!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RedPillModal;
