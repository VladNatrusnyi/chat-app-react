import {FC, useContext, useEffect, useRef} from "react";
import {IMessage, IUser} from "../../types";
import styles from "./Message.module.scss";
import {format} from "date-fns";
import {AppContext} from "../../context/AppContext/AppContext.tsx";
import {auth} from "../../firebase.ts";

interface MessageProps {
    msg: IMessage;
    recipientData: IUser | null
}

export const Message: FC<MessageProps> = ({msg, recipientData}) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const context = useContext(AppContext);

    const senderData = context?.user

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [msg]);

    const isOwnMessage = msg.from === auth.currentUser?.uid;

    return (
        <div
            className={`${styles.messageWrapper} ${isOwnMessage ? styles.own : styles.friend}`}
            ref={scrollRef}
        >
            <div className={`${styles.messageHeader} ${isOwnMessage ? styles.ownHeader : styles.friendHeader}`}>
                <span>{isOwnMessage ? senderData?.name : recipientData?.name}</span>
                <span className={styles.time}>{format(msg.createdAt.toDate(), "h:mma")}</span>
            </div>
            <div className={`${styles.messageContent} ${isOwnMessage ? styles.me : styles.friend}`}>
                {msg.media && <img src={msg.media} alt={msg.text} className={styles.messageImage}/>}
                <p className={styles.messageText}>{msg.text}</p>
                <div className={`${styles.triangle} ${isOwnMessage ? styles.triangleRight : styles.triangleLeft}`}/>
            </div>
            {
                context?.lastMessageData?.whenSeen
                && context.lastMessageData?.messageId === msg.messageId
                && isOwnMessage && (
                    <small className={styles.timestamp}> Seen {format(context.lastMessageData.whenSeen.toDate(), "h:mma")}</small>
                )}
        </div>
    );
};
