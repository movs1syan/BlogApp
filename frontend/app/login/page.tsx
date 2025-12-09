"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation";
import ModalInput from "@/components/ModalInput";
import Button from "@/components/ui/Button";
import {TriangleAlert, UserCheck} from "lucide-react";
import Link from "next/link";
import {handleLogin} from "@/lib/actions";

const LoginPage = () => {
  const [userData, setUserData] = useState<{ email: string, password: string }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prevState => ({ ...prevState!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      await handleLogin(userData);

      router.push("/");
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <main className={"flex flex-col items-center justify-center py-10 xl:px-60"}>
      <div className={"p-6 mt-8 shadow-2xl rounded-xl w-full"}>
        <UserCheck className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center py-5"}>Good to See You Again</h1>
        <h2 className={"text-center text-gray-500"}>Sign in to access your account and keep your journey going.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <ModalInput handleChange={handleChange} fieldName={"Email"} inputName={"email"} />
          <ModalInput handleChange={handleChange} fieldName={"Password"} inputName={"password"} />

          <div className="mx-auto">
            <Button htmlType={"submit"} type="primary" loading={loading}>Submit</Button>
          </div>
        </form>

        {error && (
          <div className={"flex justify-center items-center gap-2 text-red-600 mt-3"}>
            <TriangleAlert size={20} />
            <p className={"text-sm"}>{error}</p>
          </div>
        )}

        <div>
          <Link href={"/register"}>
            <Button type={"link"}>Don&#39;t have an account ?</Button>
          </Link>
          <Link href={"/forgot-password"}>
            <Button type={"link"}>Forgot password ?</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;