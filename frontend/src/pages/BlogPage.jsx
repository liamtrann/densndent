import React from "react";
import { Breadcrumb, Paragraph } from "common";
import blogBanner from "../assets/blog-banner.jpg";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    title: "THE IMPORTANCE OF INFECTION CONTROL IN DENTISTRY",
    excerpt: "Photo Credits: Daily Express",
    slug: "importance-of-infection-control",
    date: "July 25, 2025",
  },
  {
    title: "THE FIRST IMPRESSION",
    excerpt:
      "Your practice’s first impression is very important. A clean environment means dust-free, organized, and sanitized. Patients notice all the details especially when it comes to their hygiene appointments and how a practice handles its space.",
    slug: "the-first-impression",
    date: "July 25, 2025",
  },
  {
    title: "NOT JUST FOR THE HEART, RED WINE SHOWS PROMISE AS A CAVITY FIGHTER",
    excerpt: "Picture Credits: Bon Appetit",
    slug: "red-wine-cavity-fighter",
    date: "July 25, 2025",
  },
  {
    title: "5 SURPRISING FOODS THAT CAN BE TERRIBLE FOR TEETH",
    excerpt: "",
    slug: "foods-bad-for-teeth",
    date: "July 25, 2025",
  },
  {
    title: "GOOD LIGHTING IS KEY!",
    excerpt: "Picture Credit ~ A-Dec",
    slug: "good-lighting-dentistry",
    date: "July 29, 2025",
  },
  {
    title: "LET’S ENJOY SUMMERS WITH A HEALTHY SMILE",
    excerpt: "Picture Credits: myorthodontics.info",
    slug: "healthy-smile-summer",
    date: "July 29, 2025",
  },
  {
    title: "BENEFITS OF USING ULTRASONIC SCALERS",
    excerpt:
      "Do you wish to improve your dental services by using advanced technology? Why not try Ultrasonic Scalers? Nowadays, the improvement in machinery has revolutionized periodontal therapy and gingival scaling...",
    slug: "ultrasonic-scalers-benefits",
    date: "July 29, 2025",
  },
  {
    title: "THE DIFFERENCE A DENTAL CHAIR MAKES",
    excerpt:
      "When a patient comes to their dental appointment, 95% of their appointment is spent sitting in a chair. It is important that your practice invests in this critical element not only for patient comfort but also for procedure efficiencies...",
    slug: "dental-chair-difference",
    date: "July 29, 2025",
  },
];

const BlogPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray-100 px-4 py-8">
      <Breadcrumb path={["Home", "Blog"]} />

      <h1 className="text-3xl font-bold mt-6 mb-4">BLOG</h1>

      {/* Hero Banner */}
      <div className="w-full max-w-5xl mx-auto mb-10">
        <img
          src= {blogBanner}
          alt="Dens N Dente Blog Banner"
          className="w-full h-auto object-cover rounded shadow"
        />
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-6">
        LATEST ARTICLES
      </h2>

      {/* Blog Post Cards */}
      <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                DENS N DENTE BLOGS
              </p>
              <h3 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
              )}
            </div>
            <Link
              to={`/blog/${post.slug}`}
              className="text-sm font-semibold text-smiles-blue hover:underline mt-2"
            >
              READ MORE
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination (optional static example) */}
      <div className="flex justify-center mt-8 space-x-4 text-sm font-semibold">
        <span className="text-gray-500">1</span>
        <span className="text-black dark:text-white underline">2</span>
        <span className="text-gray-500">3</span>
      </div>
    </div>
  );
};

export default BlogPage;
