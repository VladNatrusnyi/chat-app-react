import { FC } from "react";
import styles from "./CustomButton.module.scss";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export const CustomButton: FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
    return (
        <button className={styles.btn} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
};


