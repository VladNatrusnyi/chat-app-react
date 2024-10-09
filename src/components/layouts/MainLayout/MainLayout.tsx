import { FC, ReactNode } from "react";
import styles from "./MainLayout.module.scss";
import {Header} from "../../Header/Header.tsx";

interface Props {
  children: ReactNode;
}

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.contentWrapper}>
          <Header />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
};


