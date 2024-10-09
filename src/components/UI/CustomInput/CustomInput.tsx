import { FC, ChangeEvent, useEffect, useRef } from "react";
import styles from "./CustomInput.module.scss";

interface InputProps {
    label?: string;
    type: string;
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
}

export const CustomInput: FC<InputProps> = ({
                                                label,
                                                type,
                                                name,
                                                value,
                                                placeholder,
                                                onChange,
                                                autoFocus = false,
                                            }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className={styles.inputContainer}>
            {!!label && <label htmlFor={name}>{label}</label>}
            <input
                ref={inputRef} // Додаємо реф до інпуту
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    );
};
