import axios from "axios";
import FilteredPosts from "@/components/FilteredPosts";

export default async function Home() {
  const { data: posts } = await axios.get("https://6910d3327686c0e9c20bce81.mockapi.io/blog/posts");

  return (
    <main>
      {/* Header */}
      <section className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="px-3 py-1 rounded-3xl bg-gray-100 w-fit">Blog</div>
        <h2 className="font-semibold md:text-5xl text-3xl">Discover our latest news</h2>
        <p className="text-center">Discover the achievements that set us apart. From groundbreaking projects to industry accolades,<br /> we take pride in our accomplishments.</p>
      </section>

      {/* Blog Posts */}
      <section className="pb-10">
        <FilteredPosts posts={posts} />
      </section>
    </main>
  );
}
