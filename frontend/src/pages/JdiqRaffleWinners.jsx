import React from "react";
import { Breadcrumb, Paragraph } from "common";

export default function JdiqRaffleWinners() {
  return (
    <div className="bg-white text-gray-800 px-6 py-10">
      <Breadcrumb path={["Home", "JDIQ raffle winners"]} />

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-white bg-[#275c8f] py-4 px-4 mb-8 uppercase tracking-wide">
        JDIQ Raffle Winners
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <img
          src="https://www.densndente.ca/site/extra%20images/JDIQ/2025/JDIQ_thank_you.png"
          alt="Thank You"
          className="w-full lg:w-1/2"
        />
        <div className="text-left text-base space-y-4 max-w-xl">
          <Paragraph>
            We want to send a big{" "}
            <span className="font-semibold">THANK YOU</span> to everyone who
            supported Dens 'N Dente during JDIQ 2025!
          </Paragraph>
          <Paragraph>
            Even though we weren’t there in person, your engagement,
            participation, and enthusiasm during the last few weeks truly meant
            the world to us 💙
          </Paragraph>
          <Paragraph>
            A big congratulations to all of our winners! 📦💳
          </Paragraph>
          <Paragraph>
            Whether you won or simply joined the fun, thank you for making this
            JDIQ special.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
