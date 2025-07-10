// src/pages/AboutUs.jsx
import React from 'react';
import Paragraph from '../common/Paragraph';

export default function AboutUs() {
  return (
    <div className="text-center text-gray-800">
      {/* Banner Section */}
      <section className="py-16 px-6">
        <h1 className="text-5xl font-light text-orange-500 mb-6">About Us</h1>
        <div className="max-w-2xl mx-auto text-lg leading-relaxed">
          <Paragraph>
            Dens 'N Dente is a Canadian based healthcare company that strives to be the best industry
            leader of healthcare supplies, service and equipment. As a fast-growing company, we are
            committed to providing our customers the best dental and healthcare supplies while adapting
            to trends and needs.
          </Paragraph>
        </div>
        <img
          src="https://sandbox.densndente.ca/images/about-banner.png"
          alt="About Banner"
          className="mx-auto mt-8 max-w-xl"
        />
      </section>

      {/* Process Section */}
      <section className="bg-[#00548F] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <img
            src="https://sandbox.densndente.ca/images/process-bg.png"
            alt="Background Graphic"
            className="w-full lg:w-1/2"
          />
          <Paragraph className="text-lg leading-relaxed">
            <span className="text-4xl font-semibold">WE</span> offer competitively priced dental and
            medical supplies from all major manufacturers. Dens ‘N Dente is committed to customer
            satisfaction, providing innovative solutions and top-quality products.
          </Paragraph>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 px-6">
        <h2 className="text-4xl text-orange-500 font-light mb-10">OUR PROCESS</h2>
        <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
          {[
            {
              title: "STRESS FREE ORDERING",
              text: "Select the product(s) or equipment you would like to order and add to cart"
            },
            {
              title: "HASSLE FREE PAYMENTS",
              text: "At checkout, pay with your Credit or Debit Card."
            },
            {
              title: "FAST DELIVERY",
              text: "Orders are fulfilled immediately"
            }
          ].map((item) => (
            <div className="text-center max-w-xs" key={item.title}>
              <div className="bg-orange-300 text-white rounded-full w-52 h-52 mx-auto flex items-center justify-center text-xl font-semibold px-4 text-center">
                {item.title}
              </div>
              <Paragraph className="mt-4 text-sm">{item.text}</Paragraph>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-orange-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <img
            src="https://sandbox.densndente.ca/images/story-bg.png"
            alt="Story Graphic"
            className="w-full lg:w-1/2"
          />
          <div className="text-left max-w-xl">
            <Paragraph className="mb-4">
              Companies only have a chance at true greatness when they are driven by a mission.
            </Paragraph>
            <Paragraph className="mb-4">
              Our mission is to transform the identity of dental supply companies…
            </Paragraph>
            <Paragraph className="mb-4">
              Dens ‘N Dente was created from a simple idea: Dentists should be able to receive quality
              products without compromising service and customer experience. As we embark in this new
              chapter of our existence, our growing company is changing the industry in an
              unprecedented way. We believe hard work and dedication to our clients will evolve the
              relationship between suppliers and customers.
            </Paragraph>
            <Paragraph className="mb-4">
              We understand, because our company was…
            </Paragraph>
            <Paragraph className="font-semibold italic">
              Created for Dentists by Dentists
            </Paragraph>
            <Paragraph className="mt-2">– Dr. Azim Parekh, CEO</Paragraph>
          </div>
        </div>
      </section>
    </div>
  );
}
