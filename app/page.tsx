import axios from "axios";
import Post from "@/components/Post";
import {PostType} from "@/shared/types";

export default async function Home() {
  const { data: posts } = await axios.get("https://6910d3327686c0e9c20bce81.mockapi.io/blog/posts");

  return (
    <>
      {/* HEADER */}
      <section className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="px-3 py-1 rounded-3xl bg-gray-100 w-fit">
          <h1>Blog</h1>
        </div>
        <h2 className="font-semibold md:text-5xl text-3xl">Discover our latest news</h2>
        <p className="text-center">Discover the achievements that set us apart. From groundbreaking projects to industry accolades,<br /> we take pride in our accomplishments.</p>
      </section>

      <main className="py-10">
        <h1 className="text-2xl font-bold mb-4">Latest News</h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15">
          {posts.slice(0, 18).map((post: PostType) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
