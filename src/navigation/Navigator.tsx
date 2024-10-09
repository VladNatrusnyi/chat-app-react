import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import {RegisterPage} from "../pages/RegisterPage.tsx";
import {HomePage} from "../pages/HomePage/HomePage.tsx";
import {PrivateRoute} from "./PrivateRoute.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {ProfilePage} from "../pages/ProfilePage/ProfilePage.tsx";


export const Navigator: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute component={<HomePage />} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<PrivateRoute component={<ProfilePage />} />} />
        </Routes>
    );
};


