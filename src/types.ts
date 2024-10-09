import {Timestamp} from "firebase/firestore";

export interface IUser {
    uid: string
    name: string;
    email: string;
    password: string;
    avatar: string;
    avatarPath: string;
    description: string;
    isOnline: boolean;
}

export interface IMessage {
    messageId: string,
    text: string;
    from: string;
    to: string;
    createdAt: Timestamp;
    media?: string;
}

export interface ILastMessage extends IMessage {
    unread: boolean;
    whenSeen: Timestamp | null
}
