"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import {apiFetch} from "@/lib/apiFetch";
import {useUser} from "@/hooks/useUser";
import ModalInput from "@/components/ModalInput";
import Button from "@/components/ui/Button";
import { UserLock } from "lucide-react";

const Login = () => {
  const [userData, setUserData] = useState<{ email: string, password: string }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <main className={"flex flex-col items-center justify-center py-10 xl:px-60"}>
      <div className={"p-6 mt-10 shadow-2xl rounded-xl w-full"}>
        <UserLock className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center py-5"}>Good to See You Again</h1>
        <h2 className={"text-center text-gray-500"}>Sign in to access your account and keep your journey going.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <ModalInput handleChange={handleChange} fieldName={"Email"} inputName={"email"} />
          <ModalInput handleChange={handleChange} fieldName={"Password"} inputName={"password"} />

          {error && <p className={"text-red-600 text-sm"}>{error}</p>}
          <div className="mx-auto">
            <Button htmlType={"submit"} type="primary">Submit</Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;