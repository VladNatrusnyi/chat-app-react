import { FC, useContext, useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./../../firebase";
import { ILastMessage, IUser } from "../../types";
import { Avatar } from "../UI/Avatar/Avatar";
import { AppContext } from "../../context/AppContext/AppContext.tsx";
import styles from "./ChatItem.module.scss";


interface UserProps {
    senderUid: string;
    user: IUser;
    selectUser: (user: IUser) => void;
    selectedRecipientData: IUser | null;
}

export const ChatItem: FC<UserProps> = ({ senderUid, user, selectUser, selectedRecipientData }) => {
    const [data, setData] = useState<ILastMessage | null>(null);

    const recipientUid = user?.uid;

    const context = useContext(AppContext);

    useEffect(() => {
        if (!recipientUid) return;

        const id = senderUid > recipientUid ? `${senderUid + recipientUid}` : `${recipientUid + senderUid}`;
        const unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
            if (doc.exists()) {
                const messageData = doc.data() as ILastMessage;
                setData(messageData);
                context?.setLastMessageData(messageData);
            }
        });

        return () => unsub();
    }, [senderUid, recipientUid]);

    return (
        <div
            className={`${styles.userWrapper} ${selectedRecipientData?.name === user.name ? styles.selectedUser : ""}`}
            onClick={() => selectUser(user)}
        >
            <div className={styles.userInfo}>
                <div className={styles.userDetail}>
                    <Avatar src={user.avatar} alt="avatar" size={65} />
                </div>
                <div className={`${styles.userStatus} ${user.isOnline ? "" : styles.offline}`}></div>
            </div>
            <div>
                {(data || user) && (
                    <>
                        <h3 className={styles.userName}>{user.name}</h3>
                        <p
                            style={(data?.from !== senderUid && data?.unread) ? {fontWeight: 'bold'} : {}}
                            className={styles.truncateText}
                        >
                            <strong>{data?.from === senderUid ? "Me: " : ""}</strong>
                            {data?.text}
                        </p>
                    </>

                )}
            </div>
        </div>
    );
};
