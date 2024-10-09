import {FC, useState, useEffect, useContext} from "react";
import { db, auth } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CustomTextarea } from "../../components/UI/CustomTextarea/CustomTextarea";
import { CustomButton } from "../../components/UI/CustomButton/CustomButton";
import { ProfileDetails } from "../../components/ProfileDetails/ProfileDetails";
import styles from "./ProfilePage.module.scss";
import {AppContext} from "../../context/AppContext/AppContext.tsx";

export const ProfilePage: FC = () => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [description, setDescription] = useState("");

    const context = useContext(AppContext);

    useEffect(() => {
        setDescription(context?.user ? context.user.description : '')
    }, [context]);

    const updateUserAvatar = (newAvatar: string, newAvatarPath: string) => {
        context?.setUser((prevUser) => (prevUser ? { ...prevUser, avatar: newAvatar, avatarPath: newAvatarPath } : prevUser));
    };

    const handleSaveDescription = async () => {
        if (context?.user && description !== context?.user.description) {
            setButtonLoading(true);
            try {
                await updateDoc(doc(db, "users", auth.currentUser?.uid || ""), {
                    description: description,
                });
                context?.setUser((prev) => (prev ? { ...prev, description } : prev));
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error updating description:", err.message);
                }
            } finally {
                setButtonLoading(false);
            }
        }
    };

    return context?.user ? (
        <section>
            <div className={styles.profileContainer}>
                <div className={styles.profileLeft}>
                    <ProfileDetails user={context.user} updateUserAvatar={updateUserAvatar} />
                </div>
                <div className={styles.profileRight}>
                    <div className={styles.textContainer}>
                        <CustomTextarea
                            label="Description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter your description here..."
                            rows={5}
                        />
                        <div className={styles.buttonContainer}>
                            <CustomButton
                                text={buttonLoading ? "Saving..." : "Save changes"}
                                disabled={description === context.user.description || buttonLoading}
                                onClick={handleSaveDescription}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    ) : null;
};
