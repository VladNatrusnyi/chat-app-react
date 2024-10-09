import { FC, useState, ChangeEvent, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import { CustomButton } from "../components/UI/CustomButton/CustomButton";
import { AuthLayout } from "../components/layouts/AuthLayout/AuthLayout";
import {ErrorBlock} from "../components/UI/ErrorBlock/ErrorBlock.tsx";
import {IUser} from "../types.ts";

interface IState extends IUser {
    error: string | null;
    loading: boolean;
}


export const RegisterPage: FC = () => {
    const [data, setData] = useState<IState>({
        uid: '',
        name: "",
        email: "",
        password: "",
        avatar: "",
        avatarPath: "",
        error: null,
        loading: false,
        description: "",
        isOnline: true
    });

    const navigate = useNavigate();
    const { name, email, password, error, loading } = data;

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            setData({ ...data, error: "All fields are required and cannot contain only spaces", loading: false });
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            setData({ ...data, error: "Please enter a valid email address", loading: false });
            return;
        }

        if (trimmedPassword.length < 6) {
            setData({ ...data, error: "Password must be at least 6 characters long", loading: false });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name: trimmedName,
                email: trimmedEmail,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true,
                avatar: "",
                avatarPath: "",
                description: "",
            });

            setData({
                uid: "",
                name: "",
                email: "",
                password: "",
                error: null,
                loading: false,
                avatar: "",
                avatarPath: "",
                description: "",
                isOnline: true
            });

            navigate("/", { replace: true });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setData({ ...data, error: err.message, loading: false });
            } else {
                setData({ ...data, error: "An unknown error occurred", loading: false });
            }
        }
    };

    return (
        <AuthLayout title="Registration">
            <form className="form" onSubmit={handleSubmit}>
                <CustomInput
                    label="Name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
                <CustomInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />
                <CustomInput
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
                <ErrorBlock error={error} />
                <CustomButton
                    text={loading ? "Creating ..." : "Register"}
                    disabled={loading}
                />
            </form>
        </AuthLayout>
    );
};
