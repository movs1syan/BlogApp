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
import type { PostType } from "@/shared/types";

const ClientPosts = ({ posts, page, totalPostsQuantity }: { posts: PostType[], page: number, totalPostsQuantity: number }) => {
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>(posts);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<Omit<PostType, "id" | "createdAt">>({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    postImage: "",
    authorName: "",
    authorSurname: "",
    authorImage: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { notify } = useNotification();

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
          params.set("search", query);
          params.set("page", "1");
        } else {
          params.delete("search");
        }

        router.replace(`/?${params.toString()}`, { scroll: false });
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost((prev) => ({...prev!, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    await apiFetch("POST", "posts", undefined, newPost);
    setLoading(false);

    setIsOpen(false);

    notify({
      type: "success",
      message: `Success!`,
      description: `Created post "${newPost.title}"`
    });

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

      <div className={"my-10 flex justify-end"}>
        <Button icon={"PlusIcon"} onClick={() => setIsOpen(true)}>Create new post</Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Latest News</h1>

      {/* Filtered posts */}
      {filteredPosts.length > 0 ? (
        <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15"}>
          {filteredPosts.map((post: PostType) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          No posts found.
        </p>
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <Activity mode={page > 1 ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowLeft"} onClick={() => goToPage(page - 1)}>Prev</Button>
        </Activity>
        <span>Page {page}</span>
        <Activity mode={page * 9 < totalPostsQuantity ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowRight"} iconPosition={"end"} onClick={() => goToPage(page + 1)}>Next</Button>
        </Activity>
      </div>

      <Modal title={"Create new post"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Form handleSubmit={handleSubmit} handleChange={handleChange} setIsModalOpen={setIsOpen} event={"Create"} loading={loading} />
      </Modal>
    </main>
  );
};

export default ClientPosts;