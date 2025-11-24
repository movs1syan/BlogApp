"use client";

import React, { Activity, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getDate } from "@/helpers/getDate";
import type {UpdatePostType, PostType} from "@/shared/types";
import Form from "@/components/Form";
import { useNotification } from "@/hooks/useNotification";
import {useUser} from "@/hooks/useUser";
import { UserCircle } from "lucide-react";
import Image from "next/image";

const ClientPost = ({ post }: { post: PostType }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<UpdatePostType>(() => {
    const { title, subtitle, description, category, image } = post;
    return { title, subtitle, description, category, image };
  });
  const [editPost, setEditPost] = useState<UpdatePostType>(() => {
    const { title, subtitle, description, category, image } = post;
    return { title, subtitle, description, category, image };
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { notify } = useNotification();
  const { user } = useUser();

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
    if (e.target.name === "image" && e.target.files) {
      setEditPost(prev => ({ ...prev, image: e.target.files![0] }));
    } else {
      setEditPost(prev => ({...prev!, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", editPost.title);
    formData.append("subtitle", editPost.subtitle);
    formData.append("description", editPost.description);
    formData.append("category", editPost.category);

    if (editPost.image) {
      formData.append("image", editPost.image);
    }

    setLoading(true);
    try {
      const updatedPost: PostType = await apiFetch("PUT", `posts/update/${post.id}`, undefined, formData);
      setCurrentPost(updatedPost);
    } catch (error: any) {
      notify({
        type: "info",
        message: "Info!",
        description: `${error.message}`,
      });

      setLoading(false);
      return;
    }

    setLoading(false);
    setIsEditOpen(false);

    router.refresh();
  };

  const fullImageURL = `http://localhost:8000${post.image}`;
  const fullAvatarURL = `http://localhost:8000${post.author.avatar}`;

  return (
    <>
      <article className="py-6 flex flex-col justify-between gap-7 md:max-w-200">
        <div className="flex flex-col justify-center gap-4">
          {currentPost.image && (
            <Image src={fullImageURL} alt={fullImageURL} width={400} height={400} className="md:h-110 w-full" unoptimized />
          )}
          <span className="text-semibold text-blue-700 text-lg">{currentPost.category}</span>

          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{currentPost.title}</h2>
            <p className="text-gray-600 text-xl">{currentPost.subtitle}</p>
            <p>{currentPost.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {post.author.avatar ? (
            <Image src={fullAvatarURL} alt={fullAvatarURL} width={40} height={40} unoptimized className={"size-10 object-cover rounded-full"} />
          ) : (
            <UserCircle size={40} />
          )}

          <div className="flex flex-col">
            <p>{post.author.name} {post.author.surname}</p>
            <p className="text-gray-600">{getDate(post.createdAt)}</p>
          </div>
        </div>

        <Activity mode={user !== null && user.id === post.userId ? "visible" : "hidden"}>
          <div className={"flex justify-end gap-5"}>
            <Button icon={"Edit"} onClick={() => setIsEditOpen(true)}>Edit</Button>
            <Button color={"red"} icon={"Trash2"} onClick={() => setIsDeleteOpen(true)}>Delete</Button>
          </div>
        </Activity>

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

      <Modal title={"Update post"} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <Form handleSubmit={handleSubmit} handleChange={handleChange} post={editPost} setIsModalOpen={setIsEditOpen} event={"Update"} loading={loading} />
      </Modal>
    </>
  );
};

export default ClientPost;