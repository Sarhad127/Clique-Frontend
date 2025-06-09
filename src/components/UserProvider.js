import React, { createContext, useState, useEffect } from "react";
import { fetchUser as fetchUserApi } from "./api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const fetchUser = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = await fetchUserApi(token);
            setUser(data);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};