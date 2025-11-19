"use client";

import React from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import type {UserType} from "@/shared/types";
import {useNotification} from "@/hooks/useNotification";

const Register = () => {
  const [newUser, setNewUser] = useState<Omit<UserType, "id">>({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatar: ""
  });
  const router = useRouter();
  const { notify } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(prev => ({ ...prev!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const data = await apiFetch("POST", "users/register", undefined, newUser);
      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (error) {
      notify({
        type: "error",
        message: "Error!",
        description: `${error}`,
      })
    }
  }
  return (
    <main className={"flex flex-col items-center justify-center p-10"}>
      <h1 className={"text-5xl font-semibold"}>Registration</h1>

      <form onSubmit={handleSubmit}>
        <input name={"name"} onChange={handleChange} className={"border"}/>
        <input name={"surname"} onChange={handleChange} className={"border"} />
        <input name={"email"} type={"email"} onChange={handleChange} className={"border"} />
        <input name={"password"} type={"password"} onChange={handleChange} className={"border"} />
        <input name={"avatar"} type={"url"} onChange={handleChange} className={"border"} />

        <button type="submit">Register</button>
      </form>
    </main>
  );
};

export default Register;