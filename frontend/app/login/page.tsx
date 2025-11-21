"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import {apiFetch} from "@/lib/apiFetch";
import {useNotification} from "@/hooks/useNotification";
import {useUser} from "@/hooks/useUser";

const Login = () => {
  const [userData, setUserData] = useState<{ email: string, password: string }>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { notify } = useNotification();
  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prevState => ({ ...prevState!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await apiFetch("POST", "users/login", undefined, userData);
      localStorage.setItem("token", data.token);
      const { id, name, surname, email, avatar } = data;
      setUser({ id, name, surname, email, avatar });

      router.push("/");
    } catch (error) {
      notify({
        type: "error",
        message: "Error!",
        description: `${error}`,
      });
    }
  };

  return (
    <main className={"flex flex-col items-center justify-center p-10"}>
      <h1 className={"text-5xl font-semibold"}>Login</h1>

      <form onSubmit={handleSubmit}>
        <input name={"email"} type={"email"} onChange={handleChange} className={"border"} />
        <input name={"password"} type={"password"} onChange={handleChange} className={"border"} />

        <button type="submit">login</button>
      </form>
    </main>
  );
};

export default Login;