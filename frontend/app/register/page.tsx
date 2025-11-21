"use client";

import React from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import type { UserType } from "@/shared/types";
import { useUser } from '@/hooks/useUser';
import Button from "@/components/ui/Button";
import ModalInput from "@/components/ModalInput";
import { registerRules } from "@/lib/rules";
import validateForm from "@/lib/validateForm";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [newUser, setNewUser] = useState<Omit<UserType, "id">>({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(prev => ({ ...prev!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const errors = validateForm(newUser, registerRules);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;

      const data = await apiFetch("POST", "users/register", undefined, newUser);
      localStorage.setItem("token", data.token);
      const { id, name, surname, email, avatar } = data;
      setUser({ id, name, surname, email, avatar });

      router.push("/");
    } catch (error: any) {
      console.log(error.message);
    }
  }
  return (
    <main className={"flex flex-col py-10 xl:px-60"}>
      <div className={"p-6 mt-10 shadow-2xl rounded-xl w-full"}>
        <UserPlus className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className={"text-3xl font-semibold text-center py-5"}>Welcome! Let's Get You Started</h1>
        <h2 className={"text-center text-gray-500"}>Fill in your details below to begin your blogging journey.</h2>

        <form onSubmit={handleSubmit} className={"flex flex-col gap-5 mt-5"}>
          <div>
            <ModalInput handleChange={handleChange} fieldName={"Name"} inputName={"name"} />
            {errors.name && <p className={"text-red-600 text-sm"}>{errors.name}</p>}
          </div>
          <div>
            <ModalInput handleChange={handleChange} fieldName={"Surname"} inputName={"surname"} />
            {errors.surname && <p className={"text-red-600 text-sm"}>{errors.surname}</p>}
          </div>
          <div>
            <ModalInput handleChange={handleChange} fieldName={"Email"} inputName={"email"} />
            {errors.email && <p className={"text-red-600 text-sm"}>{errors.email}</p>}
          </div>
          <div>
            <ModalInput handleChange={handleChange} fieldName={"Password"} inputName={"password"} />
            {errors.password && <p className={"text-red-600 text-sm"}>{errors.password}</p>}
          </div>
          <div>
            <ModalInput handleChange={handleChange} fieldName={"Avatar image URL"} inputName={"avatar"} />
            {errors.avatar && <p className={"text-red-600 text-sm"}>{errors.avatar}</p>}
          </div>

          <div className="mx-auto">
            <Button htmlType={"submit"} type="primary">Submit</Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;