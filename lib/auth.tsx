"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  id?: string;

  name: string;

  email: string;

  phone?: string;

  profileImage?: string;

  address?: {
    line1?: string;
    line2?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
  };
}

interface AuthContextType {
  user: User | null;

  auth: (
    mode: "login" | "signup",
    body: any
  ) => Promise<void>;

  logout: () => void;

  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  // ====================================================
  // LOAD USER
  // ====================================================

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      return;
    }

    try {
      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        localStorage.removeItem(
          "token"
        );

        setUser(null);

        return;
      }

      const data =
        await response.json();

      setUser(data);
    } catch (error) {
      console.error(error);

      localStorage.removeItem(
        "token"
      );

      setUser(null);
    }
  }

  // ====================================================
  // LOGIN / SIGNUP
  // ====================================================

  async function auth(
    mode: "login" | "signup",
    body: any
  ) {
    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/${mode}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

  const data = await response.json().catch(() => ({}));

if (!response.ok) {
  throw new Error(
    data.error ||
      data.message ||
      `Request failed (${response.status})`
  );
}

    // Save JWT
    localStorage.setItem(
      "token",
      data.token
    );

    // Save user
    setUser(data.user);
  }

  // ====================================================
  // LOGOUT
  // ====================================================

  function logout() {
    localStorage.removeItem(
      "token"
    );

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// USE AUTH
// ======================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}