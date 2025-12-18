"use client";

import React, {useState} from 'react';
import { useRouter } from "next/navigation"
import {TriangleAlert, MailCheck, CheckCheck} from "lucide-react";
import ModalInput from "@/components/ui/ModalInput";
import Button from "@/components/ui/Button";
import {apiFetch} from "@/lib/apiFetch";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await apiFetch("POST", "users/forgot-password", undefined, {email});
      setMessage(response.message);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <main className={"flex flex-col items-center justify-center py-10 xl:px-60"}>
      <div className={"p-6 mt-8 shadow-2xl rounded-xl w-full"}>
        <MailCheck className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center py-5"}>Recover Your Account</h1>
        <h2 className={"text-center text-gray-500"}>Provide your email address to receive a secure reset link.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <ModalInput handleChange={handleChange} fieldName={"Email"} inputName={"email"} />

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

        {message && (
          <div className={"flex justify-center items-center gap-2 text-green-600 mt-3"}>
            <CheckCheck size={20} />
            <p className={"text-sm"}>{message}</p>
          </div>
        )}

        <Button type={"link"} icon={"CornerDownLeft"} onClick={() => router.back()}>Back</Button>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;