"use client";

import React, {useState, useRef, useEffect} from 'react';
import { Activity } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { useNotification } from "@/hooks/useNotification";
import PostCard from "@/components/PostCard";
import Form from "@/components/Form";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { SearchIcon } from "lucide-react";
import type {CreatePostType, PostType} from "@/shared/types";
import {useUser} from "@/hooks/useUser";

const ClientPosts = ({ posts, page, totalPostsQuantity }: { posts: PostType[], page: number, totalPostsQuantity: number }) => {
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>(posts);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<CreatePostType>({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    image: null,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { notify } = useNotification();
  const { user } = useUser();

  useEffect(() => {
    if (posts.length === 0 && !inputRef.current) router.push(`/?page=${page - 1}`);

    setFilteredPosts(posts);
  }, [posts, page, router]);

  const handleSearchChange = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        const query = inputRef.current.value.toLowerCase();

        const params = new URLSearchParams(window.location.search);
        if (query) {
          params.set("postSearch", query);
          params.set("page", "1");
        } else {
          params.delete("postSearch");
        }

        router.replace(`/?${params.toString()}`, { scroll: false });
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image" && e.target.files) {
      setNewPost(prev => ({ ...prev, image: e.target.files![0] }));
    } else {
      setNewPost(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("subtitle", newPost.subtitle);
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);

    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    setLoading(true);
    try {
      await apiFetch("POST", "posts/create", undefined, formData);
      setNewPost({ title: "", subtitle: "", description: "", category: "", image: null });

      notify({
        type: "success",
        message: "Success!",
        description: `Created post "${newPost.title}"`
      });
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      return;
    }

    setLoading(false);
    setError(null);
    setIsOpen(false);

    router.refresh();
  };

  const goToPage = async (newPage: number) => {
    router.push(`/?page=${newPage}`);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main>
      {/* SearchBar */}
      <div className={"relative mx-auto w-100 max-w-100"}>
        <input
          ref={inputRef}
          onChange={handleSearchChange}
          className={"border-2 border-gray-200 rounded-lg pl-11 pr-4 py-2 focus:outline-blue-700 w-full"}
          placeholder={"Search for posts . . ."}
        />
        <SearchIcon size={20} className={"absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"} />
      </div>

      <Activity mode={user ? "visible" : "hidden"}>
        <div className={"mt-10 flex justify-end"}>
          <Button icon={"PlusIcon"} onClick={() => setIsOpen(true)}>Create new post</Button>
        </div>
      </Activity>

      <h1 className="text-2xl font-bold mb-6 mt-15">Latest News</h1>

      {/* Filtered posts */}
      {filteredPosts.length > 0 ? (
        <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15"}>
          {filteredPosts.map((post: PostType) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No posts found.</p>
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <Activity mode={page > 1 ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowLeft"} onClick={() => goToPage(page - 1)}>Prev</Button>
        </Activity>
        <Activity mode={page > 1 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(1)}>1</Button>
        </Activity>
        <Activity mode={page > 2 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(2)}>2</Button>
        </Activity>
        <Activity mode={page > 3 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(3)}>3</Button>
        </Activity>
        <Activity mode={page > 4 ? "visible" : "hidden"}>
          <span className={"font-bold"}>. . .</span>
        </Activity>
        <span className={"font-bold"}>{page}</span>
        <Activity mode={totalPostsQuantity - (page * 9) > 0 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 1)}>{page + 1}</Button>
        </Activity>
        <Activity mode={totalPostsQuantity - (page * 9) > 9 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 2)}>{page + 2}</Button>
        </Activity>
        <Activity mode={totalPostsQuantity - (page * 9) > 18 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 3)}>{page + 3}</Button>
        </Activity>
        <Activity mode={page * 9 < totalPostsQuantity ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowRight"} iconPosition={"end"} onClick={() => goToPage(page + 1)}>Next</Button>
        </Activity>
      </div>

      <Modal title={"Create new post"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Form handleSubmit={handleSubmit} handleChange={handleChange} setIsModalOpen={setIsOpen} event={"Create"} loading={loading} error={error} />
      </Modal>
    </main>
  );
};

export default ClientPosts;