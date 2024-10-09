import { FC, useState, ChangeEvent, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import { CustomButton } from "../components/UI/CustomButton/CustomButton";
import { AuthLayout } from "../components/layouts/AuthLayout/AuthLayout";
import { ErrorBlock } from "../components/UI/ErrorBlock/ErrorBlock";



interface LoginFormState {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
}

export const LoginPage: FC = () => {
  const [data, setData] = useState<LoginFormState>({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();
  const { email, password, error, loading } = data;

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

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setData({
        ...data,
        error: "All fields are required and cannot contain only spaces",
        loading: false,
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setData({
        ...data,
        error: "Please enter a valid email address",
        loading: false,
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      setData({
        ...data,
        error: "Password must be at least 6 characters long",
        loading: false,
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });

      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setData({ ...data, error: err.message, loading: false });
      } else {
        setData({
          ...data,
          error: "An unknown error occurred",
          loading: false,
        });
      }
    }
  };

  return (
    <AuthLayout title="Login">
      <form className="form" onSubmit={handleSubmit}>
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
        <div className="btn_container">
          <CustomButton text={loading ? "Logging in ..." : "Login"} disabled={loading} />
        </div>
      </form>
    </AuthLayout>
  );
};
