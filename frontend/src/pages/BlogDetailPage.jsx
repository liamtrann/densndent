import React from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "common";
import blogBanner from "../assets/blog-banner.jpg"; // fallback image

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
          Dental procedures can cause a release of oral fluids such as blood and
          saliva. Keeping this in mind, it is essential to follow the standard
          protocol in{" "}
          <span className="text-orange-500 font-medium">infection control</span>{" "}
          to prevent the risk of transferring diseases.
        </p>

        <h3 className="mt-4 font-bold text-lg">
          Why Infection Control is Important
        </h3>

        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Controls Spread of Disease –</strong> Dental practitioners
            should always use proper universal precautions like wearing{" "}
            <span className="text-orange-500 font-medium">
              gloves, gowns, masks,
            </span>{" "}
            and <span className="text-orange-500 font-medium">goggles</span>.
            The use of disinfectants and sterilizers is also recommended to
            prevent cross-contamination.
          </li>
          <li>
            <strong>Stops Growth of Bacteria –</strong> Sterilization techniques
            should be prioritized in dental clinics to stop the growth of
            bacteria. The use of autoclaves is encouraged, and dental
            practitioners should disinfect all equipment to kill bacteria that
            might be adhering to these tools.
          </li>
          <li>
            <strong>Improves Dental Reputation –</strong> When you follow
            standard protocol, your clients will feel safe and satisfied with
            your services and equipment. Word of mouth from your satisfied
            patients will boost your dental sales and productivity.
          </li>
          <li>
            <strong>Protects Patient and Staff –</strong> Infection control
            prevents cross infection between patient-to-patient,
            patient-to-staff, as well as staff-to-staff. By adhering to the
            infection control policies, you can be sure that the entire team and
            your patients will be safe from diseases.
          </li>
        </ul>

        <p className="mt-4">
          Here at Dens ‘N Dente, we provide essential infection control
          solutions for the needs of the dental industry. Check out our{" "}
          <a href="https://densndente.ca" className="text-blue-500 underline">
            website
          </a>{" "}
          to learn more about the infection control products we offer.
        </p>

        <p className="mt-6 font-semibold">– The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "the-first-impression": {
    title: "The First Impression",
    author: "The Dens ‘N Dente Team",
    date: "July 7th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/home-page/first-impression.jpg",
    content: (
      <>
        <p>
          Your practice’s{" "}
          <span className="text-orange-500 font-medium">first impression</span>{" "}
          is very important. A clean environment means dust-free, organized, and
          sanitized. Patients notice all the details especially when it comes to
          their hygiene appointments and how a practice handles its space.
        </p>

        <p>
          Having a great disinfectant on hand is key. We suggest keeping one in
          each clinical room or station. One brand that we offer is{" "}
          <span className="text-orange-500 font-medium">CaviWipes</span>. These
          disinfectant wipes are non-woven and nonabrasive towelettes that are
          quick and easy to use.
        </p>

        <p>
          They are not only used in dental offices but in operating rooms,
          surgical centers, and other operatories with critical-care areas.
        </p>

        <p>
          To shop for this product, click{" "}
          <a
            href="https://www.densndente.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-smiles-blue underline"
          >
            here
          </a>
          . Remember to leave a positive first impression!
        </p>

        <p className="mt-6 font-semibold">~ The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "red-wine-cavity-fighter": {
    title: "Not just for the heart, red wine shows promise as a cavity fighter",
    author: "The Dens ‘N Dente Team",
    date: "June 24th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/red-wine.jpg",
    credit: "Picture Credits: Bon Appetit",
    content: (
      <>
        <p>
          For anyone searching for another reason to enjoy a glass of red wine
          with dinner, here is a good one: A new study has found that red wine,
          as well as grape seed extract, could potentially help prevent
          cavities.
        </p>

        <p className="mt-4">
          But it’s quite important to understand the science behind it.
        </p>

        <p className="mt-4">
          Red wine can reduce the number of bad bacteria that stick to the soft
          gum tissues. These bacteria can cause cavities and plaques, therefore,
          wine acts as an antioxidant. Red wine has two specific polyphenols.
          These two polyphenols are{" "}
          <span className="text-orange-500 font-medium">caffeic</span> and{" "}
          <span className="text-orange-500 font-medium">P-coumaric acids</span>.
        </p>

        <p className="mt-4">
          According to laboratory testing, these two antioxidants prevent bad
          bacteria from spreading to cells. Red wine should be consumed in
          moderation as it is still an alcoholic beverage.
        </p>

        <p className="mt-6 font-semibold text-orange-500">
          ~ The Dens ‘N Dente Healthcare
        </p>
      </>
    ),
  },

  "foods-bad-for-teeth": {
    title: "5 Surprising Foods That Can Be Terrible for Teeth",
    author: "The Dens ‘N Dente Team",
    date: "June 9th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/foods-bad-for-teeth.jpg",
    content: (
      <>
        <p>
          <strong>1. Bread:</strong> When a person eats bread, the saliva in the
          mouth breaks down starch into sugar. This leads to the creation of a
          gummy-like substance that can easily stick in the gaps and crevices of
          your teeth. If it is not removed, it can cause cavities by eroding the
          enamel of the teeth. We all love eating bread therefore you do not
          need to cut it out of your diet. To avoid cavities, try to choose a
          less-refined variety like multi grain or whole grain bread which is
          high in fiber and contains less sugar.
        </p>

        <p>
          <strong>2. Ice:</strong> Some people think that ice is just frozen
          water. The reality is it can cause a lot of damage. Chewing on ice
          seems enjoyable but it can cause cracks and can chip your teeth.
          Therefore, try your best to resist the urge to chew. Try eating baby
          carrots or celery sticks instead.
        </p>

        <p>
          <strong>3. Citrus:</strong> We often think that citrus is good for our
          health. Although it is true, it is very important to eat or drink it
          in moderation. Fruits like oranges and grapefruit have vital nutrients
          but make sure not to overconsume them. Try to sip some water after
          having fruits with citrus to wash off acid from your teeth.
        </p>

        <p>
          <strong>4. Dried Fruits:</strong> Whenever we are hungry, we try to go
          for dried fruits. They are sticky and can stay on your teeth for a
          longer period. If it’s hard for you to part ways from dried fruits,
          try brushing and flossing every time you eat them to remove the
          residue.
        </p>

        <p>
          <strong>5. Popcorn:</strong> Can you resist popcorn? Quite hard isn’t
          it. Small particles of popcorn can stick between your teeth. This
          leads to bacteria that can cause tooth decay. Make sure to rinse and
          floss every time you make a bag of popcorn for yourself.
        </p>

        <p className="mt-4">
          To learn more about which foods can damage your teeth feel free to
          contact us at Dens ‘N Dente Healthcare
        </p>

        <p className="mt-6 font-semibold">~ The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "good-lighting-dentistry": {
    title: "Good Lighting is Key!",
    author: "The Dens ‘N Dente Team",
    date: "June 29th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/good-lighting.jpg", // use actual image or keep blank
    credit: "Picture Credit ~ A-Dec",
    content: (
      <>
        <p>
          We all have heard the saying{" "}
          <span className="font-semibold">“good lighting is key”</span>.
          However, you may wonder – how does this apply to the world of
          dentistry? Having the right lighting can be essential when it comes to
          running your practice. As you examine your patients in your chair,
          having a reliable and energy efficient light can make a big
          difference.
        </p>

        <p>
          Therefore, make sure to equip your dental practice with lights
          designed to provide the best treatment and patient care experience.
          Dental lights allow you to identify details, match tooth shades,
          evaluate and perform procedures all while reducing eye strain.
        </p>

        <p>
          For more information about finding the best light for your practice,
          contact Dens ’N Dente today!
        </p>

        <p className="mt-6 font-semibold">~ The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "healthy-smile-summer": {
    title: "Let’s Enjoy Summers with a Healthy Smile",
    author: "The Dens ‘N Dente Team",
    date: "June 14th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/healthy-smile.jpg", // Replace with your actual hosted image if needed
    credit: "Picture Credits: myorthodontics.info",
    content: (
      <>
        <p>
          <strong>The refreshing summer is here!</strong>
        </p>

        <p>
          This season invites incredible open-air fun, traveling, and sports.
          But this does not mean we should get loose with our oral well-being.
          In fact, summer can be an extraordinary time to assist your family to
          brush up on propensities to keep their teeth solid all year long.
        </p>

        <h3 className="mt-4 font-semibold text-lg">Remain in a “ROUTINE”</h3>
        <p>
          It is important to keep your oral well-being on track. Consider making
          a fun chart to keep track of morning and evening brushing as well as
          everyday flossing. Figure out what plan or rewards work best for your
          family. Keep up with it to avoid any chance of dental issues in the
          long run.
        </p>

        <h3 className="mt-4 font-semibold text-lg">
          Say “GOODBYE“ to sugary snacks and drinks
        </h3>
        <p>
          Whether you are heading to a beach or just going out to enjoy some
          sun, you can easily consume snacks like chips, candies, sodas, and
          treats without even realizing it. These choices are packed with sugars
          and can lead to tooth decay and cavities over time. Instead, we
          suggest consuming apple slices, blocks of cheese, grapes, and nuts to
          stay energized all day long.
        </p>
        <p>
          One of the best drinks is water. But because of its plain taste people
          are not fond of it. Most individuals try to go for fruit juices and
          smoothies to beat the heat. These drinks are full of sugar and can
          cause a sudden spike in the insulin level. Therefore, to stay
          hydrated, try infusing water with some lemon, mint, and citric fruits.
          This would be the most perfect way to replace other sugary liquids.
        </p>

        <h3 className="mt-4 font-semibold text-lg">
          Say “HELLO” to mouth guards:
        </h3>
        <p>
          If you or your family are active in summer sports, make sure to
          protect your teeth and utilize mouth guards. Sports wounds regularly
          result in chipped front teeth, broken tooth roots, and cut lips.
        </p>

        <p>
          If you have any questions or concerns on how to get a perfect smile
          for your family this summer, please feel free to contact us at Dens ‘N
          Dente Healthcare.
        </p>

        <p className="mt-6 font-semibold">~ The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "ultrasonic-scalers-benefits": {
    title: "Benefits of Using Ultrasonic Scalers",
    author: "The Dens ‘N Dente Team",
    date: "June 2nd, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/ultrasonic-scalers.jpg", // Replace with correct URL if needed
    credit: "Photo credit: Northwest Dental",
    content: (
      <>
        <p>
          Do you wish to improve your dental services by using advanced
          technology? Why not try{" "}
          <span className="text-orange-500 font-medium">
            Ultrasonic Scalers
          </span>
          ? Nowadays, the improvement in machinery has revolutionized
          periodontal therapy and gingival scaling. The use of Ultrasonic
          Scalers has made cleaning the teeth and gums easier, better, and more
          accurate. An Ultrasonic Scaler is used for removing bacteria and hard
          deposits from the mouth that a toothbrush can not do on its own.
        </p>

        <p>
          If a clinic is going to perform deep cleaning, then having an
          ultrasonic scaler is beneficial. It offers many benefits including
          reduction of hand fatigue and tissue trauma when doing a particular
          dental procedure.
        </p>

        <p>
          Ultrasonic Scalers not only reduce treatment time for patients who get
          regular cleaning but also for individuals with heavy plaque deposits
          and teeth stains.
        </p>

        <p>
          If you want to provide comfort and ease to your patients with better
          dental results during cleaning, scaling, or root planning, then invest
          in ultrasonic scalers. To learn more about ultrasonic scalers or other
          dental supplies contact us at Dens ‘N Dente!
        </p>

        <p className="mt-6 font-semibold">– The Dens ‘N Dente Team</p>
      </>
    ),
  },

  "dental-chair-difference": {
    title: "The Difference a Dental Chair Makes",
    author: "The Dens ‘N Dente Team",
    date: "May 27th, 2022",
    image:
      "https://www.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/blog/dental-chair.jpg", // Replace with correct image URL if needed
    content: (
      <>
        <p>
          When a patient comes to their dental appointment,{" "}
          <strong>95% of their appointment is spent sitting in a chair</strong>.
          It is important that your practice invests in this critical element
          not only for patient comfort but also for procedure efficiencies. The
          reclined tilt in the chair is wheelchair-friendly, thereby helping to
          eliminate the possibility of transfer injury for such patients.
        </p>

        <p>
          With the help of technological advancement nowadays, unnecessary
          movements can be avoided by using dual touchpads and electronic
          adjustments.
        </p>

        <h3 className="mt-4 font-bold text-lg">Important Consideration:</h3>

        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            Make sure to look for a chair having adjustable edges with ample
            padding at the front, for the utmost comfort.
          </li>
          <li>
            Ensure the chair has all the up-to-date features and is
            user-friendly.
          </li>
          <li>
            A dental chair should have a contemporary design that showcases a
            sophisticated look for the operatory, creating a relaxing
            environment for patients.
          </li>
        </ul>

        <p className="mt-4">
          Make the best decision for your practice and your patient’s experience
          and invest in a good dental chair.
        </p>

        <p>
          If you need to update your dental equipment or dental supplies,
          contact Dens ‘N Dente Healthcare Today!
        </p>

        <p className="mt-6 font-semibold">~ The Dens ‘N Dente Team</p>
      </>
    ),
  },
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const post = blogArticles[slug];

  if (!post) {
    return (
      <div className="text-center py-20 text-xl">Blog post not found.</div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray-100 px-4 py-8">
      <Breadcrumb path={["Home", "Blog", post.title]} />
      <h1 className="text-3xl font-bold text-center mt-6 mb-2">{post.title}</h1>

      <div className="text-center text-sm mb-6 text-gray-500">
        <span className="mr-4">
          Written by <strong>{post.author}</strong>
        </span>
        <span>
          Published on <strong>{post.date}</strong>
        </span>
      </div>

      {post.image && (
        <div className="max-w-4xl mx-auto mb-4">
          <img
            src={post.image}
            alt={post.title}
            className="rounded shadow w-full object-cover"
          />
        </div>
      )}

      {post.credit && (
        <p className="text-sm text-center text-gray-500 mb-6 italic">
          {post.credit}
        </p>
      )}

      <div className="max-w-3xl mx-auto leading-relaxed space-y-4 text-justify">
        {post.content}
      </div>
    </div>
  );
};

export default BlogDetailPage;
