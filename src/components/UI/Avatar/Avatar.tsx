import { FC } from "react";
import personIcon from './../../../assets/img/personIcon.webp';
import styles from './Avatar.module.scss';

interface AvatarProps {
    src?: string;
    alt: string;
    className?: string;
    classNameForImg?: string;
    size?: number;
}

export const Avatar: FC<AvatarProps> = ({ src, alt, className = "", classNameForImg = "", size = 50 }) => {
    return (
        <div
            className={`${styles.imgWrapper} ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={src && src.trim() !== "" ? src : personIcon}
                alt={alt}
                className={`${styles.avatarImg} ${classNameForImg}`}
                style={{ width: size, height: size }}
            />
        </div>
    );
};

