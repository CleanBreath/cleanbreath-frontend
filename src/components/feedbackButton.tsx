import React from "react";
import styles from "../../styles/feedbackButton.module.css"
import FEEDBACK_ICON from "../../public/feedbackicon.svg";

type FeedbackButtonProps = {
    onClick: () => void;
};

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
    return (
        <div className={styles.feedbackButtonContainer} onClick={onClick}>
            <span className={styles.text}>개발자에게 의견 전달하기</span>
            <FEEDBACK_ICON className={styles.icon} />
        </div>
    );
};

export default FeedbackButton;
