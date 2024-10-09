import { FC, useState, ChangeEvent, useEffect } from "react";
import { storage, db, auth } from "../../firebase";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { Camera, Trash } from "lucide-react";
import { Avatar } from "../../components/UI/Avatar/Avatar";
import { IUser } from "../../types";
import styles from "./ProfileDetails.module.scss";

interface ProfileDetailsProps {
    user: IUser;
    updateUserAvatar: (newAvatar: string, newAvatarPath: string) => void;
}

export const ProfileDetails: FC<ProfileDetailsProps> = ({ user, updateUserAvatar }) => {
    const [img, setImg] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Завантаження нового аватару
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImg(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (img) {
            const uploadImg = async () => {
                setLoading(true);
                const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);
                try {
                    if (user.avatarPath) await deleteObject(ref(storage, user.avatarPath));
                    const snap = await uploadBytes(imgRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
                    await updateDoc(
                        doc(db, "users", auth.currentUser?.uid || ""), { avatar: url, avatarPath: snap.ref.fullPath }
                    );
                    updateUserAvatar(url, snap.ref.fullPath);
                } catch (err) {
                    console.error("Error uploading image:", err);
                } finally {
                    setLoading(false);
                }
            };
            uploadImg();
        }
    }, [img]);

    const deleteImage = async () => {
        try {
            const confirm = window.confirm("Delete avatar?");
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));
                await updateDoc(doc(db, "users", auth.currentUser?.uid || ""), { avatar: "", avatarPath: "" });
                updateUserAvatar("", "");
            }
        } catch (err) {
            console.error("Error deleting image:", err);
        }
    };

    return (
        <div className={styles.profileDetails}>
            <div className={styles.imgContainer}>
                <Avatar src={user.avatar} alt="avatar" size={100} />
            </div>

            {loading ? (
                <p className={styles.loadingText}>Loading...</p>
            ) : (
                <div className={styles.overlay}>
                    <div className={styles.buttonIcon}>
                        <label htmlFor="photo">
                            <Camera />
                        </label>
                    </div>
                    {user.avatar && (
                        <div className={styles.buttonIcon} onClick={deleteImage}>
                            <Trash />
                        </div>
                    )}
                </div>
            )}

            <div className={styles.textContainer}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
            </div>
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={handleImageChange}
            />
        </div>
    );
};

