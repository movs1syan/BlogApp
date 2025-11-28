"use client";

import React, {useState} from 'react';
import {useParams} from "next/navigation"
import {TriangleAlert, KeyRound} from "lucide-react";
import ModalInput from "@/components/ModalInput";
import Button from "@/components/ui/Button";
import {apiFetch} from "@/lib/apiFetch";

const ForgotPasswordPage = () => {
  const [password, setPassword] = useState<{ newPassword: string, confirmNewPassword: string }>({
    newPassword: "",
    confirmNewPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{token: string}>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await apiFetch("POST", `users/reset-password/${token}`, undefined, password);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <main className={"flex flex-col items-center justify-center py-10 xl:px-60"}>
      <div className={"p-6 mt-8 shadow-2xl rounded-xl w-full"}>
        <KeyRound className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center py-5"}>Reset Your Password</h1>
        <h2 className={"text-center text-gray-500"}>Create a new password for your account.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <ModalInput handleChange={handleChange} fieldName={"New password"} inputName={"newPassword"} />
          <ModalInput handleChange={handleChange} fieldName={"Confirm new password"} inputName={"confirmNewPassword"} />

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
      </div>
    </main>
  );
};

export default ForgotPasswordPage;