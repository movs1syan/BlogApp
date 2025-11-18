"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import {apiFetch} from "@/lib/apiFetch";
import type {UserType} from "@/shared/types";
import {useNotification} from "@/hooks/useNotification";

const Login = () => {
  const [user, setUser] = useState<Omit<UserType, "id" | "name" | "surname">>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { notify } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prevState => ({ ...prevState!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await apiFetch("POST", "users/login", undefined, user);

      router.push("/");
    } catch {
      notify({
        type: "error",
        message: "Error!",
        description: `Invalid credentials`,
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