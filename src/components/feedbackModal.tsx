// components/FeedbackModal.tsx
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from "../../styles/feedbackModal.module.css";

const POST_API_URL = "https://server.bluesky-cleanbreath.com/v1/feedback/add";

type FeedbackModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    if (!isOpen) return null;

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
        const feedbackData = {
            title: title,
            content: content,
        };

        try {
            const response = await axios.post(POST_API_URL, feedbackData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('피드백이 성공적으로 전송되었습니다:', response.data);
            window.alert('피드백 전송이 완료되었습니다!');
        } catch (error) {
            console.error('피드백 전송 중 오류가 발생했습니다:', error);
            window.alert('피드백 전송에 실패했습니다!');
        }

        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <h2>피드백하기</h2>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={handleTitleChange}
                        className={styles.input}
                    />
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={handleContentChange}
                        className={styles.textarea}
                    />
                    <button onClick={handleSubmit} className={styles.submitButton}>제출</button>
                    <button onClick={onClose} className={styles.closeButton}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;