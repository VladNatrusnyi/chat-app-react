import { FC, useEffect, useState } from "react";
import { IMessage, IUser } from "../../types";
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { MessageForm } from "../MessageForm/MessageForm";
import { Message } from "../Message/Message";
import { Avatar } from "../UI/Avatar/Avatar";
import styles from "./ChatWindow.module.scss";

interface ChatWindowProps {
    selectedRecipientData: IUser | null;
}

export const ChatWindow: FC<ChatWindowProps> = ({ selectedRecipientData }) => {
    const [msgs, setMsgs] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const senderUid = auth.currentUser?.uid;

    useEffect(() => {
        if (!selectedRecipientData || !senderUid) return;

        const recipientUid = selectedRecipientData.uid;
        const id = senderUid > recipientUid ? `${senderUid + recipientUid}` : `${recipientUid + senderUid}`;
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));

        setLoading(true);
        setError(null);

        const unsub = onSnapshot(
            q,
            (querySnapshot) => {
                const msgs: IMessage[] = [];
                querySnapshot.forEach((doc) => {
                    msgs.push(doc.data() as IMessage);
                });
                setMsgs(msgs);
                setLoading(false);
            },
            (err) => {
                console.log(err)
                setLoading(false);
                setError("Failed to load messages. Please try again.");
            }
        );

        const updateLastMsg = async () => {
            try {
                const docSnap = await getDoc(doc(db, "lastMsg", id));
                if (docSnap.exists() && docSnap.data()?.from !== senderUid) {
                    await updateDoc(doc(db, "lastMsg", id), { unread: false, whenSeen: Timestamp.fromDate(new Date()) });
                }
            } catch (err) {
                console.error("Error updating last message:", err);
            }
        };

        updateLastMsg();

        return () => unsub();
    }, [selectedRecipientData, senderUid]);

    return (
        <div className={styles.messagesContainer}>
            {selectedRecipientData ? (
                <>
                    <div className={styles.messagesUser}>
                        <Avatar
                            src={selectedRecipientData.avatar}
                            alt="avatar"
                            size={140}
                            classNameForImg={styles.notRadius}
                        />
                        <div className={styles.infoWrapper}>
                            <p className={styles.messagesUserName}>{selectedRecipientData.name}</p>
                            <p className={styles.messagesUserDescription} title={selectedRecipientData.description}>
                                {selectedRecipientData.description}
                            </p>
                        </div>
                    </div>
                    <div className={styles.messages}>
                        {loading ? (
                            <p className={styles.loading}>Loading...</p>
                        ) : error ? (
                            <p className={styles.errorMsg}>{error}</p>
                        ) : (
                            msgs.length
                                ? msgs.map((msg) => <Message
                                    key={msg.messageId}
                                    msg={msg}
                                    recipientData={selectedRecipientData}
                                />)
                                : <p className={styles.noMessages}>No messages yet.</p>
                        )}
                    </div>
                    <MessageForm selectedRecipientData={selectedRecipientData} senderUid={senderUid} />
                </>
            ) : (
                <h3 className={styles.noConv}>Select a chat to start conversation</h3>
            )}
        </div>
    );
};
