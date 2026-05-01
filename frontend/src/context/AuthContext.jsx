import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const cleanToken = token.replace(/^"|"$/g, "");
                const decoded = jwtDecode(cleanToken);
                setUser({
                    username: decoded.username,
                    role: decoded.role,
                    token: cleanToken,
                });
            } catch (err) {
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        const cleanToken = token.replace(/^"|"$/g, "");
        localStorage.setItem("token", cleanToken);
        const decoded = jwtDecode(cleanToken);
        setUser({
            username: decoded.username,
            role: decoded.role,
            token: cleanToken,
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
