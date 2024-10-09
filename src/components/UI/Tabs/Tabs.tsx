import { FC } from "react";
import styles from "./Tabs.module.scss";

interface Tab {
    id: number;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: number;
    onTabClick: (id: number) => void;
}

export const Tabs: FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`${styles.tabItem} ${activeTab === tab.id ? styles.activeTab : ""}`}
                    onClick={() => onTabClick(tab.id)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
};
