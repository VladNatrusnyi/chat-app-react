import { FC } from "react";

export const Loading: FC = () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#586670",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h2 style={{ color: "#ffffff" }}>Loading...</h2>
        </div>
    );
};
