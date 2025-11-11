"use client";

import React, {useState, useRef, useEffect} from 'react';
import { Activity } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import PostCard from "@/components/PostCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ModalInput from "@/components/ModalInput";
import { SearchIcon } from "lucide-react";
import type { PostType } from "@/shared/types";

const PostsContainer = ({ posts, page }: { posts: PostType[], page: number }) => {
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>(posts);
  const [newPost, setNewPost] = useState<PostType>({
    id: String(posts.length + 1),
    title: "",
    subtitle: "",
    description: "",
    category: "",
    post_pic: "",
    author_name: "",
    author_surname: "",
    author_pic: "",
    createdAt: String(new Date()),
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleSearchChange = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        const query = inputRef.current.value.toLowerCase();

        const filtered = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.subtitle.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost((prev) => ({...prev!, [e.target.name]: e.target.value }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiFetch("POST", "/posts", undefined, { ...newPost });

    setIsOpen(false);
  };

  const goToPage = async (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  return (
    <main>
      {/* SearchBar */}
      <div className={"relative mx-auto w-100 max-w-100"}>
        <input
          type={"text"}
          ref={inputRef}
          onChange={handleSearchChange}
          className={"border-2 border-gray-200 rounded-lg pl-11 pr-4 py-2 focus:outline-none focus:border-blue-700 w-full"}
          placeholder={"Search for posts. . ."}
        />
        <SearchIcon size={20} className={"absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"} />
      </div>

      <div className={"my-10 flex justify-end"}>
        <Button icon={"PlusIcon"} onClick={() => setIsOpen(true)}>Create new post</Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Latest News</h1>

      {/* Filtered posts */}
      <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15"}>
        {filteredPosts.map((post: PostType) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        {page > 1 && (
          <Button type={"link"} icon={"ArrowLeft"} onClick={() => goToPage(page - 1)}>
            Prev
          </Button>
        )}
        <span>Page {page}</span>
        {posts.length === 9 && (
          <Button type={"link"} icon={"ArrowRight"} iconPosition={"end"} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        )}
      </div>

      <Activity mode={isOpen ? "visible" : "hidden"}>
        <Modal title={"Create new post"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
            <ModalInput handleChange={handleChange} fieldName={"Title"} inputName={"title"} />
            <ModalInput handleChange={handleChange} fieldName={"Subtitle"} inputName={"subtitle"} />
            <ModalInput handleChange={handleChange} fieldName={"Description"} inputName={"description"} />
            <ModalInput handleChange={handleChange} fieldName={"Category"} inputName={"category"} />
            <ModalInput handleChange={handleChange} fieldName={"PostCard image URL"} inputName={"post_pic"} />
            <ModalInput handleChange={handleChange} fieldName={"Author name"} inputName={"author_name"} />
            <ModalInput handleChange={handleChange} fieldName={"Author surname"} inputName={"author_surname"} />
            <ModalInput handleChange={handleChange} fieldName={"Author image URL"} inputName={"author_pic"} />

            <div className="flex gap-5 justify-end mt-3">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button htmlType="submit" type="primary">Create</Button>
            </div>
          </form>
        </Modal>
      </Activity>
    </main>
  );
};

export default PostsContainer;