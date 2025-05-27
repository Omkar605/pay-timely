import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
		}, []);
		const login = (email, password) => {
			if (email === "oz@gmail.com" && password === "oz") {
				// Simulate a successful login
				// In a real application, you would send a request to your server here
				// and get a token in response.
				// For example:
				// const response = await fetch("/api/login", {
				// method: "POST",
				// headers: {
				// "Content-Type": "application/json",
				// },
				// body: JSON.stringify({ email, password }),
				// });
				// const data = await response.json();
				// localStorage.setItem("token", data.token);
				localStorage.setItem("token", "your_token_here");
                setIsAuthenticated(true);
                return true;
			}

		}
		const register = ({ email }) => {
  if (email === 'demo@paytimely.com') {
    return { success: false, message: 'User already exists' };
  }
  return { success: true };
};

		const logout = () => {
			localStorage.removeItem("token");
			setIsAuthenticated(false);
		}
		return (
			<AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
				{children}
			</AuthContext.Provider>
		);
}
// export const useAuth = () => {
// const context = useContext(AuthContext);
// if (!context) {
// throw new Error("useAuth must be used within an AuthProvider");
// }
// return context;
// }

export const useAuth = () => useContext(AuthContext);
