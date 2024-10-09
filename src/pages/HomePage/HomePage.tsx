import { FC, useContext, useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { IUser } from "../../types";
import styles from "./HomePage.module.scss";
import { ChatWindow } from "../../components/ChatWindow/ChatWindow";
import { ChatsList } from "../../components/ChatsList/ChatsList";
import { AppContext } from "../../context/AppContext/AppContext.tsx";

export const HomePage: FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedRecipientData, setSelectedRecipientData] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const senderUid = auth.currentUser?.uid;

    const context = useContext(AppContext);
    const { setShowSideBar } = context!;

    useEffect(() => {
        if (!senderUid) return;

        setIsLoading(true);
        setError(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "not-in", [senderUid]));

        const unsub = onSnapshot(
            q,
            (querySnapshot) => {
                const users: IUser[] = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data() as IUser);
                });
                setUsers(users);
                setIsLoading(false);
            },
            (err) => {
                setError("Failed to load users. Please try again later.");
                setIsLoading(false);
                console.error("Error loading users:", err);
            }
        );

        return () => unsub();
    }, [senderUid]);

    const handleSelectUser = (user: IUser) => {
        setSelectedRecipientData(user);
        setShowSideBar(false);
    };

    return (
        <div className={styles.homeContainer}>
            <ChatWindow selectedRecipientData={selectedRecipientData} />

            <ChatsList
                users={users}
                selectedRecipientData={selectedRecipientData}
                selectUser={handleSelectUser}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};
