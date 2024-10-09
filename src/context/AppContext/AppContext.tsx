import React, { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged} from "firebase/auth";
import {auth, db} from "./../../firebase";
import { Loading } from "../../components/UI/Loading/Loading";
import {ILastMessage, IUser} from "../../types";
import {doc, getDoc} from "firebase/firestore";

interface AuthContextProps {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
    lastMessageData: ILastMessage | null;
    setLastMessageData: React.Dispatch<React.SetStateAction<ILastMessage | null>>;
    clearContext: () => void;
    showSideBar: boolean;
    setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export type TContext = AuthContextProps | null

export const AppContext = createContext<TContext>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastMessageData, setLastMessageData] = useState<ILastMessage | null>(null);
    const [showSideBar, setShowSideBar] = useState<boolean>(false);

    const fetchUserData = async (userUid: string | undefined) : Promise<void> =>  {
        try {
            const docSnap = await getDoc(doc(db, "users", userUid || ""));
            if (docSnap.exists()) {
                setUser(docSnap.data() as IUser);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                // console.log("Error fetching user data:", err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearContext = () => {
        setUser(null)
        setLastMessageData(null)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchUserData(user?.uid)
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                lastMessageData,
                setLastMessageData,
                clearContext,
                showSideBar,
                setShowSideBar
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
