"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/apiFetch";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getDate } from "@/helpers/getDate";
import type { PostType } from "@/shared/types";
import Form from "@/components/Form";
import {useNotification} from "@/hooks/useNotification";

const ClientPost = ({ post }: { post: PostType }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Omit<PostType, "id" | "createdAt" | "updatedAt" | "author" | "userId">>(() => {
    const { id, createdAt, updatedAt, userId, author, ...rest } = post;
    return rest;
  });
  const [editPost, setEditPost] = useState<Omit<PostType, "id" | "createdAt" | "updatedAt" | "author" | "userId">>(() => {
    const { id, createdAt, updatedAt, userId, author, ...rest } = post;
    return rest;
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { notify } = useNotification();

  const onDelete = async () => {
    setLoading(true);
    try {
      await apiFetch("DELETE", `posts/delete/${post.id}`);
    } catch (error) {
      notify({
        type: "error",
        message: "Error!",
        description: `${error}`,
      });

      setLoading(false);
      return;
    }
    setLoading(false);

    router.back();
    setTimeout(() => router.refresh(), 10);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPost((prev) => ({...prev!, [e.target.name]: e.target.value }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const updatedPost: PostType = await apiFetch("PUT", `posts/update/${post.id}`, undefined, editPost);
      setCurrentPost(updatedPost);
    } catch (error) {
      notify({
        type: "error",
        message: "Error!",
        description: `${error}`,
      });

      setLoading(false);
      return;
    }

    setLoading(false);
    setIsEditOpen(false);

    router.refresh();
  };

  return (
    <>
      <article className="py-6 flex flex-col justify-between gap-7 md:max-w-200">
        <div className="flex flex-col justify-center gap-4">
          {currentPost.image && (
            <Image src={currentPost.image} alt="Featured Image" width={400} height={400} className="md:h-110 w-full" />
          )}

          <span className="text-semibold text-blue-700 text-lg">{currentPost.category}</span>

          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{currentPost.title}</h2>
            <p className="text-gray-600 text-xl">{currentPost.subtitle}</p>
            <p>{currentPost.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {post.author.avatar && (
            <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="size-10 rounded-full object-cover"/>
          )}

          <div className="flex flex-col">
            <p>{post.author.name} {post.author.surname}</p>
            <p className="text-gray-600">{getDate(post.createdAt)}</p>
          </div>
        </div>

        <div className={"flex justify-end gap-5"}>
          <Button icon={"Edit"} onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button color={"red"} icon={"Trash2"} onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        </div>

        <div>
          <Button type={"text"} icon={"CornerDownLeft"} onClick={() => router.back()}>
            Back to Posts
          </Button>
        </div>
      </article>

      <Modal title={"Delete post"} isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to delete post &quot;{post.title}&quot; ?</p>
          <div className="flex gap-5 justify-end">
            <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="primary" color="red" loading={loading} onClick={() => onDelete()}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal title={"Edit post"} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <Form handleSubmit={handleSubmit} handleChange={handleChange} post={editPost} setIsModalOpen={setIsEditOpen} event={"Edit"} loading={loading} />
      </Modal>
    </>
  );
};

export default ClientPost;