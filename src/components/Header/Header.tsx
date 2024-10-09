import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Додаємо useLocation
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import styles from "./Header.module.scss";
import { ArrowLeft, LogOut, Menu } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {AppContext} from "../../context/AppContext/AppContext.tsx";


export const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Використовуємо useLocation для отримання поточного шляху
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const data = useContext(AppContext);
    const { showSideBar, setShowSideBar } = data!;

    const handleSignOut = async () => {
        if (data?.user) {
            try {
                await updateDoc(doc(db, "users", data.user.uid), {
                    isOnline: false,
                });
                await signOut(auth);
                data.clearContext();
                navigate("/login", { replace: true });
            } catch (error) {
                console.error("Error signing out: ", error);
            }
        }
    };

    return (
        <nav className={styles.navbar}>
            <div>
                {location.pathname === "/" && isMobile ? (
                    showSideBar ? (
                        <ArrowLeft
                            size={30}
                            className={styles.showUsersButton}
                            onClick={() => setShowSideBar(!showSideBar)}
                        />
                    ) : (
                        <Menu
                            size={30}
                            className={styles.showUsersButton}
                            onClick={() => setShowSideBar(!showSideBar)}
                        />
                    )
                ) : (
                    <Link className={`${styles.link} ${styles.title}`} to="/">Chat bots 2.0</Link>
                )}
            </div>
            <div className={styles.links}>
                {data?.user ? (
                    <div className={styles.profile}>
                        <Link className={styles.linkProfile} to="/profile">Profile</Link>
                        <LogOut className={styles.logOutIcon} onClick={handleSignOut}/>
                    </div>
                ) : (
                    <>
                        <Link className={styles.link} to="/register">Register</Link>
                        <Link className={styles.link} to="/login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
