"use client";

import React, { useState } from "react";
import { Activity } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getDate } from "@/helpers/getDate";
import type { PostType } from "@/shared/types";
import ModalInput from "@/components/ModalInput";

const IndividualPagePost = ({ post }: { post: PostType }) => {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<Omit<PostType, "id"> | null>({
    title: post.title,
    subtitle: post.subtitle,
    description: post.description,
    category: post.category,
    post_pic: post.post_pic,
    author_name: post.author_name,
    author_surname: post.author_surname,
    author_pic: post.author_pic,
    createdAt: post.createdAt,
  });

  const onDelete = async () => {
    await axios.delete(`https://6910d3327686c0e9c20bce81.mockapi.io/blog/posts/${post.id}`);

    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPost((prev) => ({...prev!, [e.target.name]: e.target.value }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.put(`https://6910d3327686c0e9c20bce81.mockapi.io/blog/posts/${post.id}`, {...editPost});
  };

  return (
    <>
      <article className="py-6 flex flex-col justify-between gap-7 md:max-w-200">
        <div className="flex flex-col justify-center gap-4">
          <Image src={post.post_pic} alt="Featured Image" width={400} height={400} className="md:h-110 w-full" />

          <span className="text-semibold text-blue-700 text-lg">{post.category}</span>

          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{post.title}</h2>
            <p className="text-gray-600 text-xl">{post.subtitle}</p>
            <p>{post.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Image src={post.author_pic} alt={post.author_name} width={40} height={40} className="size-10 rounded-full object-cover"/>

          <div className="flex flex-col">
            <p>{post.author_name} {post.author_surname}</p>
            <p className="text-gray-600">{getDate(post.createdAt)}</p>
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
            <ModalInput handleChange={handleChange} fieldName={"Post image URL"} inputName={"post_pic"} value={editPost?.post_pic} />
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

export default IndividualPagePost;