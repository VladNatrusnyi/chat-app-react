import { FC, ChangeEvent } from "react";
import styles from "./CustomTextarea.module.scss";

interface TextareaProps {
    label?: string;
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

export const CustomTextarea: FC<TextareaProps> = ({
                                                      label,
                                                      name,
                                                      value,
                                                      placeholder,
                                                      onChange,
                                                      rows = 5,
                                                  }) => {
    return (
        <div className={styles.textareaContainer}>
            {!!label && <label htmlFor={name}>{label}</label>}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.textarea}
                rows={rows}
            />
        </div>
    );
};
