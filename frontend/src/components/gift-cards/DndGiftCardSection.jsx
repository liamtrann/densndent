import React from "react";
import { Paragraph } from "../../common";

export default function DndGiftCardSection() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-smiles-blue mb-4">
        THE DND GIFT CARD
      </h2>

      <Paragraph className="mb-6">
        The Dens ‘N Dente Healthcare (DND) Gift Card empowers you to maximize
        your purchasing power with customized solutions. Reinvest in your clinic
        using earned credit to save on future orders — unlocking continuous
        benefits and efficiency.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">
        Where can I use this gift card?
      </h3>
      <Paragraph className="mb-6">
        • The DND Gift Card is redeemable only through Dens ‘N Dente.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">
        How does this work?
      </h3>
      <Paragraph className="mb-4">
        It functions as a credit tied to your account at the time of purchase.
        Just notify your Sales Rep when you're ready to redeem — we'll handle
        the rest.
      </Paragraph>
      <Paragraph className="italic text-sm text-gray-600 mb-6">
        Note: Valid only on call-in orders.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">
        What’s in it for me?
      </h3>
      <ul className="space-y-6 text-gray-800 text-sm">
        <li>
          <strong>• Higher Value, Greater Benefit.</strong>
          <br />
          Receive better value than the e-gift card when you choose DND.
        </li>
        <li>
          <strong>• Tailored for Your Clinic’s Needs.</strong>
          <br />
          Invest in products carefully selected for your clinic from trusted
          brands.
        </li>
        <li>
          <strong>• Personalized Support from our Sales Reps.</strong>
          <br />
          Get expert advice on maximizing the value of your card and choosing
          the right products.
        </li>
        <li>
          <strong>• Ongoing Rewards for Future Savings:</strong>
          <br />
          Earn additional gift cards by continuing to purchase — building a
          cost-saving reward cycle.
        </li>
      </ul>
    </div>
  );
}
