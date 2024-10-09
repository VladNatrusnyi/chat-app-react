import { FC, ReactNode } from "react";

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <section style={{
            maxWidth: 400,
            margin: '0 auto',
            padding: 10,
            background: '#fff',
            marginTop: 20,
            borderRadius: 10
        }}>
            <h3 style={{
                color: '#333333'
            }}>{title}</h3>
            {children}
        </section>
    );
};


