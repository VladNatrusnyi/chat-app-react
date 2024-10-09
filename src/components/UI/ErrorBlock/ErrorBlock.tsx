import { FC } from "react";

interface ErrorBlockProps {
    error: string | null;
}

export const ErrorBlock: FC<ErrorBlockProps> = ({ error }) => {
    if (!error) return null;

    return <p style={{ fontSize: 12, color: 'red', textAlign: 'center' }}>{error}</p>;
};

