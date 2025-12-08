"use client";

import React, { useState, useEffect } from 'react';
import {apiFetch} from "@/lib/apiFetch";
import {PostType, UserWithPostType} from "@/shared/types";
import PostCard from "@/components/PostCard";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ModalInput from "@/components/ModalInput";
import {TriangleAlert} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const UserProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<UserWithPostType | null>(null);
  const [editUser, setEditUser] = useState<{name: string, surname: string, avatar: string | File | null} | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userData = await apiFetch("GET", `users/profile`);
      const { name, surname, avatar } = userData;

      setCurrentUser(userData);
      setEditUser({ name, surname, avatar });
      setPosts(userData.posts);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatar" && e.target.files) {
      setEditUser(prevState => ({ ...prevState!, avatar: e.target.files![0] }));
    } else {
      setEditUser(prevState => ({ ...prevState!, [e.target.name]: e.target.value }))
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (editUser) {
      formData.append("name", editUser.name);
      formData.append("surname", editUser.surname);

      if (editUser.avatar) {
        formData.append("avatar", editUser.avatar);
      }

      setLoading(true);

      try {
        const updatedUser = await apiFetch("PUT", "users/update", undefined, formData);
        setCurrentUser(updatedUser);

        router.refresh();
      } catch (error: any) {
        setLoading(false);
        setError(error.message);

        return;
      }

      setLoading(false);
      setIsEditOpen(false);
      setError(null);
    }
  };

  const fullAvatarUrl = `http://localhost:8000${currentUser?.avatar}`;

  return currentUser && (
    <>
    <main className={"flex flex-col py-10"}>
      <div className={"flex gap-10"}>
        {currentUser.avatar ? (
          <Image src={fullAvatarUrl} alt={fullAvatarUrl} width={150} height={200} unoptimized />
        ) : (
          <Image src={"/profile-picture.png"} alt={"avatar"} width={200} height={200} />
        )}
        <div className={"flex flex-col gap-26"}>
          <div className={"flex flex-col gap-3"}>
            <span className={"text-3xl"}>{currentUser.name} {currentUser.surname}</span>
            <span className={"text-gray-500"}>{currentUser.email}</span>
          </div>

          <div className={"flex items-center gap-3"}>
            <Button icon={"UserPen"} onClick={() => setIsEditOpen(true)}>Update profile</Button>

            <Link href="/change-password">
              <Button type={"link"}>Change password</Button>
            </Link>
          </div>
        </div>
      </div>

      <h1 className={"font-bold text-2xl mt-10"}>My posts</h1>
      {posts.length > 0 ? (
        <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-3"}>
          {posts.map((post) => {
            post = {
              ...post,
              author: {
                name: currentUser.name,
                surname: currentUser.surname,
                email: currentUser.surname,
                avatar: currentUser.avatar,
              }
            };

            return (
              <PostCard key={post.id} post={post} />
            );
          })}
        </div>
      ) : (
        <p className={"mt-3"}>No posts yet</p>
      )}
    </main>

      <Modal title={"Update profile"} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
          <ModalInput handleChange={handleChange} fieldName={"Name"} inputName={"name"} value={editUser?.name} />
          <ModalInput handleChange={handleChange} fieldName={"Surname"} inputName={"surname"} value={editUser?.surname} />
          <label className={"flex flex-col gap-2"}>
            Upload image for avatar
            <Button icon={"ImageUp"}>
              <input type={"file"} name={"avatar"} accept={"image/*"} onChange={handleChange} className={"cursor-pointer"} />
            </Button>
          </label>

          {error && (
            <div className={"flex justify-center items-center gap-2 text-red-600 mt-2"}>
              <TriangleAlert size={20} />
              <p className={"text-sm"}>{error}</p>
            </div>
          )}
          <div className="flex gap-5 justify-end mt-3">
            <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={loading}>Update</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserProfilePage;