"use client";

import React from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {  RegisterFormType } from "@/shared/types";
import Button from "@/components/ui/Button";
import ModalInput from "@/components/ui/ModalInput";
import { UserPlus, TriangleAlert } from "lucide-react";
import Link from "next/link";
import {handleRegister} from "@/lib/actions";

const Register = () => {
  const [newUser, setNewUser] = useState<RegisterFormType>({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar" && e.target.files) {
      setNewUser(prev => ({ ...prev, avatar: e.target.files![0] }));
    } else {
      setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newUser.name);
    formData.append("surname", newUser.surname);
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);
    formData.append("confirmPassword", newUser.confirmPassword);

    if (newUser.avatar) {
      formData.append("avatar", newUser.avatar);
    }

    setLoading(true);

    try {
      await handleRegister(formData);

      router.push("/");
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  }
  return (
    <main className={"flex flex-col py-10 xl:px-60"}>
      <div className={"p-6 shadow-2xl rounded-xl w-full"}>
        <UserPlus className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center"}>Welcome! Let&#39;s Get You Started</h1>
        <h2 className={"text-center text-gray-500 mt-2"}>Fill in your details below to begin your blogging journey.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <ModalInput handleChange={handleChange} fieldName={"Name"} inputName={"name"} />
          <ModalInput handleChange={handleChange} fieldName={"Surname"} inputName={"surname"} />
          <ModalInput handleChange={handleChange} fieldName={"Email"} inputName={"email"} />
          <ModalInput handleChange={handleChange} fieldName={"Password"} inputName={"password"} />
          <ModalInput handleChange={handleChange} fieldName={"Confirm password"} inputName={"confirmPassword"} />
          <label className={"flex flex-col gap-2"}>
            Upload image for avatar
            <Button icon={"ImageUp"}>
              <input type={"file"} name={"avatar"} accept={"image/*"} onChange={handleChange} className={"cursor-pointer"} />
            </Button>
          </label>

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

        <Link href={"/login"}>
          <Button type={"link"}>Already have an account ?</Button>
        </Link>
      </div>
    </main>
  );
};

export default Register;