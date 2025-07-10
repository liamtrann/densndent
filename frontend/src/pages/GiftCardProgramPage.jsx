import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import Paragraph from "../common/Paragraph";
import GiftCardTable from "../components/GiftCardTable";
import EGiftCardSection from "../components/EGiftCardSection";
import DndGiftCardSection from "../components/DndGiftCardSection";
import GiftCardRules from "../components/GiftCardRules";

export default function GiftCardProgramPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb path={["Home", "Promotions & Catalogues", "DND Gift Card Program"]} />

      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-8">
        THE GIFT CARD PROGRAM
      </h1>

      <Paragraph className="text-lg mb-4">
        Our Gift Card Program was designed to express our gratitude for your loyalty and support.
        It’s our way of saying, <strong>“Thank you for choosing Dens ‘N Dente Healthcare!”</strong>
      </Paragraph>

      <Paragraph className="text-md mb-6">
        To better serve our customer’s needs, we offer <strong>two</strong> options:
      </Paragraph>

      <ul className="list-disc ml-5 text-md text-gray-800 space-y-4 mb-8">
        <li>
          <strong>The Everything E-gift Card:</strong> A versatile digital option used across multiple stores.
        </li>
        <li>
          <strong>The DND Gift Card:</strong> A credit applied to your next order with Dens ‘N Dente.
        </li>
      </ul>

      <Paragraph className="italic text-orange-600 font-semibold mb-10">
        Discover more about these exciting options below and choose the one that fits your needs best!
      </Paragraph>

      <GiftCardTable />
      <EGiftCardSection />
      <DndGiftCardSection />
      <GiftCardRules />
    </div>
  );
}
