import { FC, ChangeEvent, useEffect, useState, useRef } from "react";
import { CustomInput } from "../UI/CustomInput/CustomInput";
import { CustomButton } from "../UI/CustomButton/CustomButton";
import { Paperclip } from "lucide-react";
import styles from "./MessageForm.module.scss";
import { db, storage } from "../../firebase";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { IUser } from "../../types";
import { botsConfig } from "../../mock/botsConfig";

interface MessageFormProps {
    selectedRecipientData: IUser;
    senderUid: string | undefined;
}

export const MessageForm: FC<MessageFormProps> = ({
                                                            selectedRecipientData,
                                                            senderUid,
                                                        }) => {
    const [text, setText] = useState<string>("");
    const [img, setImg] = useState<File | null>(null);
    const [showIcon, setShowIcon] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isSpamBotActive = useRef<boolean>(false);

    const isValidMessage = text.trim().length > 0;

    const recipientUid = selectedRecipientData.uid;
    const chatId = senderUid! > recipientUid ? `${senderUid + recipientUid}` : `${recipientUid + senderUid}`;

    const isBot = botsConfig.some((bot) => bot.uid === recipientUid);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImg(e.target.files[0]);
            setShowIcon(true);
        }
    };

    const echoBotResponse = async () => {
        await sendMessage("Echo_bot", text, recipientUid);
    };

    const reverseBotResponse = async () => {
        const reversedText = text.split("").reverse().join("");
        setTimeout(async () => {
            await sendMessage("Reverse_bot", reversedText, recipientUid);
        }, 3000);
    };

    const startSpamBot = () => {
        const spamMessages = ["Hello!", "Are you there?", "Just checking...", "Why are you ignoring me?"];
        isSpamBotActive.current = true;

        const sendSpamMessage = async () => {
            if (!isSpamBotActive.current) return;

            const randomIndex = Math.floor(Math.random() * spamMessages.length);
            await sendMessage("Spam_bot", spamMessages[randomIndex], recipientUid);

            const randomTime = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000;
            // const randomTime = Math.floor(Math.random() * 5000) + 10000;
            setTimeout(sendSpamMessage, randomTime);
        };

        sendSpamMessage();
    };

    useEffect(() => {
        isSpamBotActive.current = recipientUid === "Spam_bot";

        if (isSpamBotActive.current) {
            startSpamBot();
        }

        return () => {
            isSpamBotActive.current = false;
        };
    }, [recipientUid]);

    const ignoreBotResponse = () => {
        // bot do nothing
    };

    // Функція для відправлення повідомлення
    const sendMessage = async (from: string, messageText: string, to: string) => {
        const botMessageId = Date.now().toString();
        await addDoc(collection(db, "messages", chatId, "chat"), {
            messageId: botMessageId,
            text: messageText,
            from: from,
            to: to,
            createdAt: Timestamp.fromDate(new Date()),
            media: "",
        });

        await setDoc(doc(db, "lastMsg", chatId), {
            messageId: botMessageId,
            text: messageText,
            from: from,
            to: to,
            createdAt: Timestamp.fromDate(new Date()),
            media: "",
            unread: true,
            whenSeen: null,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValidMessage) return;
        setIsLoading(true);

        if (!selectedRecipientData || !senderUid) return;

        let url: string | undefined;

        if (img) {
            const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);
            const snap = await uploadBytes(imgRef, img);
            const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            url = dlUrl;
        }

        const messageId: string = Date.now().toString();

        await addDoc(collection(db, "messages", chatId, "chat"), {
            messageId,
            text,
            from: senderUid,
            to: recipientUid,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
        });

        await setDoc(doc(db, "lastMsg", chatId), {
            messageId,
            text,
            from: senderUid,
            to: recipientUid,
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
            whenSeen: null,
        });

        setText("");
        setIsLoading(false);
        setShowIcon(false);
        setImg(null);

        if (isBot) {
            switch (recipientUid) {
                case "Echo_bot":
                    echoBotResponse();
                    break;
                case "Reverse_bot":
                    reverseBotResponse();
                    break;
                case "Spam_bot":
                    break;
                case "Ignore_bot":
                    ignoreBotResponse();
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <form className={styles.messageForm} onSubmit={handleSubmit}>
            <label className={styles.attachmentIcon} htmlFor="img">
                {showIcon && <div className={styles.circle}></div>}
                <Paperclip color="#646770" />
            </label>
            <input
                onChange={handleImageChange}
                type="file"
                id="img"
                accept="image/*"
                style={{ display: "none" }}
            />

            <div className={styles.inputWrapper}>
                <CustomInput
                    autoFocus={true}
                    type="text"
                    name="message"
                    value={text}
                    placeholder="Start chatting!"
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className={styles.buttonWrapper}>
                <CustomButton
                    disabled={isLoading || !isValidMessage}
                    text="Send message"
                />
            </div>
        </form>
    );
};

