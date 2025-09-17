
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const login = async (email, password) => {
		try {
			// For development, allow mock login
			if (email === "oz@gmail.com" && password === "oz") {
				localStorage.setItem("token", "mock_token");
				setIsAuthenticated(true);
				return true;
			}

			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			
			const data = await response.json();
			
			if (response.ok) {
				localStorage.setItem("token", data.token);
				setIsAuthenticated(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const register = async ({ firstName, lastName, email, password }) => {
		try {
			const response = await axios.post(
				`${API_URL}/auth/register`,
				{ firstName, lastName, email, password },
				{
					headers: {
						"Content-Type": "application/json",
					}
				}
			);
			console.log(response.data);
			if (response.data.status) {
				return { success: true };
			}
			return { success: false, message: response.data?.message || 'Registration failed' };
		} catch (error) {
			console.error("Registration error:", error);
			return { success: false, message: error.response?.data?.message || 'Server error' };
		}
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
