// BlogDetailPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "common";
import blogBanner from "../assets/blog-banner.jpg";

const blogArticles = {
  "importance-of-infection-control": {
    title: "The Importance of Infection Control in Dentistry",
    author: "The Dens ‘N Dente Team",
    date: "July 14th, 2022",
    image: blogBanner,
    credit: "Photo Credits: Daily Express",
    content: (
      <>
        <p>
          Dental procedures can cause a release of oral fluids such as blood and saliva. Keeping this in mind, it is essential to follow the standard protocol in <span className="text-orange-500 font-medium">infection control</span> to prevent the risk of transferring diseases.
        </p>

        <h3 className="mt-4 font-bold text-lg">Why Infection Control is Important</h3>

        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Controls Spread of Disease –</strong> Dental practitioners should always use proper universal precautions like wearing <span className="text-orange-500 font-medium">gloves, gowns, masks,</span> and <span className="text-orange-500 font-medium">goggles</span>. The use of disinfectants and sterilizers is also recommended to prevent cross-contamination.
          </li>
          <li>
            <strong>Stops Growth of Bacteria –</strong> Sterilization techniques should be prioritized in dental clinics to stop the growth of bacteria. The use of autoclaves is encouraged, and dental practitioners should disinfect all equipment to kill bacteria that might be adhering to these tools.
          </li>
          <li>
            <strong>Improves Dental Reputation –</strong> When you follow standard protocol, your clients will feel safe and satisfied with your services and equipment. Word of mouth from your satisfied patients will boost your dental sales and productivity.
          </li>
          <li>
            <strong>Protects Patient and Staff –</strong> Infection control prevents cross infection between patient-to-patient, patient-to-staff, as well as staff-to-staff. By adhering to the infection control policies, you can be sure that the entire team and your patients will be safe from diseases.
          </li>
        </ul>

        <p className="mt-4">
          Here at Dens ‘N Dente, we provide essential infection control solutions for the needs of the dental industry. Check out our <a href="https://densndente.ca" className="text-blue-500 underline">website</a> to learn more about the infection control products we offer.
        </p>

        <p className="mt-6 font-semibold">– The Dens ‘N Dente Team</p>
      </>
    ),
  },

  // You can add more articles here using slug keys
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const post = blogArticles[slug];

  if (!post) {
    return <div className="text-center py-20 text-xl">Blog post not found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray-100 px-4 py-8">
      <Breadcrumb path={["Home", "Blog", post.title]} />
      <h1 className="text-3xl font-bold text-center mt-6 mb-2">{post.title}</h1>

      <div className="text-center text-sm mb-6 text-gray-500">
        <span className="mr-4">Written by <strong>{post.author}</strong></span>
        <span>Published on <strong>{post.date}</strong></span>
      </div>

      {post.image && (
        <div className="max-w-4xl mx-auto mb-4">
          <img src={post.image} alt={post.title} className="rounded shadow w-full object-cover" />
        </div>
      )}

      {post.credit && (
        <p className="text-sm text-center text-gray-500 mb-6 italic">{post.credit}</p>
      )}

      <div className="max-w-3xl mx-auto leading-relaxed space-y-4 text-justify">
        {post.content}
      </div>
    </div>
  );
};

export default BlogDetailPage;
