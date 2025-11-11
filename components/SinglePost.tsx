"use client";

import React, { useState } from "react";
import { Activity } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/apiFetch";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ModalInput from "@/components/ModalInput";
import { getDate } from "@/helpers/getDate";
import type { PostType } from "@/shared/types";

const SinglePost = ({ post }: { post: PostType }) => {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Omit<PostType, "id">>(post);
  const [editPost, setEditPost] = useState<Omit<PostType, "id">>(() => {
    const { id, ...rest } = post;
    return rest;
  });

  const onDelete = async () => {
    await apiFetch("DELETE", `/posts/${post.id}`);

    router.push(`/`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPost((prev) => ({...prev!, [e.target.name]: e.target.value }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPost = await apiFetch("PUT", `/posts/${post.id}`, undefined, {...editPost});
    const { id, ...rest } = updatedPost as PostType;
    setCurrentPost(rest);
  };

  return (
    <>
      <article className="py-6 flex flex-col justify-between gap-7 md:max-w-200">
        <div className="flex flex-col justify-center gap-4">
          <Image src={currentPost.post_pic} alt="Featured Image" width={400} height={400} className="md:h-110 w-full" />

          <span className="text-semibold text-blue-700 text-lg">{currentPost.category}</span>

          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{currentPost.title}</h2>
            <p className="text-gray-600 text-xl">{currentPost.subtitle}</p>
            <p>{currentPost.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Image src={currentPost.author_pic} alt={currentPost.author_name} width={40} height={40} className="size-10 rounded-full object-cover"/>

          <div className="flex flex-col">
            <p>{currentPost.author_name} {currentPost.author_surname}</p>
            <p className="text-gray-600">{getDate(currentPost.createdAt)}</p>
          </div>
        </div>

        <div className={"flex justify-end gap-5"}>
          <Button icon={"Edit"} onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button color={"red"} icon={"Trash2"} onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        </div>

        <Link href={`/`}>
          <Button type={"text"} icon={"CornerDownLeft"}>
            Back to Posts
          </Button>
        </Link>
      </article>

      <Activity mode={isDeleteOpen ? "visible" : "hidden"}>
        <Modal title={"Delete post"} isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <div className="flex flex-col gap-5">
            <p>Are you sure you want to delete post &quot;{post.title}&quot; ?</p>
            <div className="flex gap-5 justify-end">
              <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button type="primary" color="red" icon="Trash2" iconPosition="end" onClick={() => onDelete()}>Delete</Button>
            </div>
          </div>
        </Modal>
      </Activity>

      <Activity mode={isEditOpen ? "visible" : "hidden"}>
        <Modal title={"Edit post"} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
            <ModalInput handleChange={handleChange} fieldName={"Title"} inputName={"title"} value={editPost?.title} />
            <ModalInput handleChange={handleChange} fieldName={"Subtitle"} inputName={"subtitle"} value={editPost?.subtitle} />
            <ModalInput handleChange={handleChange} fieldName={"Description"} inputName={"description"} value={editPost?.description} />
            <ModalInput handleChange={handleChange} fieldName={"Category"} inputName={"category"} value={editPost?.category} />
            <ModalInput handleChange={handleChange} fieldName={"PostCard image URL"} inputName={"post_pic"} value={editPost?.post_pic} />
            <ModalInput handleChange={handleChange} fieldName={"Author name"} inputName={"author_name"} value={editPost?.author_name} />
            <ModalInput handleChange={handleChange} fieldName={"Author surname"} inputName={"author_surname"} value={editPost?.author_surname} />
            <ModalInput handleChange={handleChange} fieldName={"Author image URL"} inputName={"author_pic"} value={editPost?.author_pic} />

            <div className="flex gap-5 justify-end mt-3">
              <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button htmlType="submit" type="primary" onClick={() => setIsEditOpen(false)}>Edit</Button>
            </div>
          </form>
        </Modal>
      </Activity>
    </>
  );
};

export default SinglePost;