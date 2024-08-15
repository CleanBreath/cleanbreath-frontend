import NON_SMOKING_ICON from "../../public/nonSmok.svg";
import SMOKING_ICON from "../../public/smok.svg";
import styles from "../../styles/areaToggle.module.css";

interface AreaToggleProps {
    isNonSmoking: boolean;
    isSmoking: boolean;
    nonSmokingToggle: () => void;
    smokingToggle: () => void;
}

export default function AreaToggleComponent({isNonSmoking, isSmoking, nonSmokingToggle, smokingToggle} : AreaToggleProps) {
    return (
        <>
            <div className={styles.toggle}>
                <div className={isNonSmoking ? styles.nonSmokingIconOpen : styles.nonSmokingIcon} onClick={nonSmokingToggle}>
                    <NON_SMOKING_ICON />
                </div>
                <div className={isSmoking ? styles.smokingIconOpen : styles.smokingIcon} onClick={smokingToggle}>
                    <SMOKING_ICON />
                </div>
            </div>
            <div className={styles.state}>
                <div className={styles.box1}>
                    <div className={styles.circle + ' ' + styles.green}></div>
                    <div className={styles.labelText}>흡연구역</div>
                </div>
                <div className={styles.box2}>
                    <div className={styles.circle + ' ' + styles.orange}></div>
                    <div className={styles.labelText}>금연구역</div>
                </div>
                <div className={styles.box3}>
                    <div className={styles.circle + ' ' + styles.red}></div>
                    <div className={styles.labelText}>절대 보호구역</div>
                </div>
            </div>
        </>
        
    );
}

