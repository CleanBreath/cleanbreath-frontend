import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from "../../styles/feedbackModal.module.css";
import LOGO_ICON from "../../public/logo.svg";

const POST_API_URL = "https://server.bluesky-cleanbreath.com/v1/feedback/add";

type FeedbackModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            window.alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        const feedbackData = {
            title,
            content,
        };

        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.post(POST_API_URL, feedbackData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('피드백이 성공적으로 전송되었습니다:', response.data);
            window.alert('피드백 전송이 완료되었습니다!');
            setTitle('');  // Reset title after submission
            setContent('');  // Reset content after submission
            onClose();
        } catch (error) {
            console.error('피드백 전송 중 오류가 발생했습니다:', error);
            setError('피드백 전송에 실패했습니다!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <LOGO_ICON className={styles.logoIcon}/>
                        <h1 className={styles.cleanBreath}>CleanBreath</h1>
                        <p className={styles.modalHashTags}>#금연구역 #흡연구역 #클브</p>
                        <button className={styles.closeButton} onClick={onClose}>&times;</button>
                    </div>
                    <h2 className={styles.modalTitle}><span className={styles.highlightGreen}>피드백</span> 하기</h2>
                    <input
                        type="text"
                        placeholder="제목을 작성 해 주세요!"
                        value={title}
                        onChange={handleTitleChange}
                        className={styles.input}
                        disabled={isLoading}
                    />
                    <textarea
                        placeholder="부족한 점,바라는 점이 있다면 자유롭게 작성 해 주세요!"
                        value={content}
                        onChange={handleContentChange}
                        className={styles.textarea}
                        disabled={isLoading}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button onClick={handleSubmit} className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? '전송 중...' : '제출'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
