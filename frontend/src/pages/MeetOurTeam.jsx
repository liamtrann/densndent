import React from "react";
import { Breadcrumb, Paragraph } from "../common";

const teamMembers = [
  {
    name: "Carrie Reeve Dreyer",
    title: "Account Coordinator",
    image: "/images/team/carrie.png",
    description: [
      "With over six years of experience as a dental sales coordinator with Dens ‘N Dente, I have honed my skills in managing accounts and fostering strong relationships with dental professionals to help aid them in their business growth through exceptional customer service.",
      "Beyond dentistry, I find joy in spectating sports and participating in recreational activities, such as golfing and swimming. I highly value my role as a family-oriented individual and prioritize spending quality time with my children.",
    ],
  },
  {
    name: "Leila Heidary",
    title: "Account Coordinator",
    image: "/images/team/leila.png",
    description: [
      "I’ve been with Smiles First for 6 years, initially in logistics and now as an account coordinator for Dens ‘N Dente Healthcare. Applying my business expertise, sales strategies, and product knowledge, I assist clients in selecting top-market products.",
      "Outside of work, I enjoy cycling, yoga, music, and quality time with loved ones.",
    ],
  },
  {
    name: "Safeh A. Pairose",
    title: "Head of Sales",
    image: "/images/team/safeh.png",
    description: [
      "With a professional background encompassing 10 years of valuable experience in the field of dentistry, I strive to bring both expertise and enthusiasm to the table.",
      "In addition to my commitment to oral health, I also take pleasure in engaging in various leisure activities including basketball, the gym, and quality time spent with my cherished friends and family. I am ecstatic to help your office bring success and unlock new levels of achievement and growth together.",
    ],
  },
  {
    name: "Nisarg Raval",
    title: "Account Coordinator",
    image: "/images/team/nisarg.png",
    description: [
      "An International trained dentist from India, my passion lies in providing exceptional dental care using only the highest quality materials. I love sports and connecting with people, and I strive to create a warm and welcoming environment for all my clients.",
      "With my background in dentistry and genuine care for each individual, I aim to build trust and establish lasting relationships in the dental sales field.",
    ],
  },
  {
    name: "Katie Mak",
    title: "Account Coordinator",
    image: "/images/team/katie.png",
    description: [
      "I am excited to join Dens ‘N Dente Healthcare as an Account Coordinator. With over 9 years of experience as a pharmaceutical sales representative, I’m passionate about building relationships and delivering tailored solutions.",
      "When I’m not at work, I love spending time practicing yoga and hiking. Nature has always been a source of inspiration for me.",
    ],
  },
  {
    name: "Samantha Trieu",
    title: "Account Coordinator",
    image: "/images/team/samantha.png",
    description: [
      "When it comes to helping dental offices grow, being able to nurture strong relationships is immensely rewarding to me. I’m excited to utilize my expertise from a combination of dental and sales experience to deliver individualized service to dental professionals.",
      "At my leisure, I enjoy searching for unique house plants to add to my growing collection.",
    ],
  },
  {
    name: "Marila Fontenelle Sily de Assis",
    title: "Customer Service Representative Lead",
    image: "/images/team/marila.png",
    description: [
      "Passionate about delivering exceptional customer experiences, I design tailored solutions that create value, nurture lasting relationships, and elevate every interaction.",
      "Beyond my professional dedication, I treasure time with loved ones and enjoy travelling, restaurants, movies, and home decor.",
    ],
  },
];

const TeamMemberCard = ({ name, title, image, description }) => (
  <div className="flex flex-col lg:flex-row items-center gap-6 py-8 border-b">
    <div className="w-36 h-36 relative flex-shrink-0">
      <img
        src={image}
        alt={name}
        className="rounded-full object-cover w-full h-full border-4 border-orange-400"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-orange-500 font-semibold">{name}</h3>
      <h4 className="font-bold mb-2">{title}</h4>
      {description.map((text, index) => (
        <Paragraph
          key={index}
          className="mb-2 border-l-2 pl-4 border-orange-500"
        >
          {text}
        </Paragraph>
      ))}
    </div>
  </div>
);

export default function MeetOurTeam() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb path={["Home", "Meet Our Team"]} />

      <h1 className="text-center text-4xl font-light text-blue-900 mb-12">
        MEET OUR <span className="font-bold">SALES TEAM</span>
      </h1>

      <div className="space-y-8">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.name} {...member} />
        ))}
      </div>
    </div>
  );
}
