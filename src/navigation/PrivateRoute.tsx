import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AppContext} from "../context/AppContext/AppContext.tsx";


interface PrivateRouteProps {
    component: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component }) => {
    const data = useContext(AppContext);

    return data?.user ? component : <Navigate to="/login" />;
};


