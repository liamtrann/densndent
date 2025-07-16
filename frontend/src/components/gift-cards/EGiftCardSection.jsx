import React from "react";
import { Paragraph } from "common";

export default function EGiftCardSection() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-smiles-blue mb-4">
        THE E-GIFT CARD
      </h2>

      <Paragraph className="mb-6">
        The e-gift cards are provided by EverythingCard, Canada’s #1 corporate
        gifting platform, proudly made and serviced in Canada. Trusted by the
        University of Toronto, Emirates, RBC, Toyota and more — it’s your
        convenient, versatile gifting solution.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">
        Where can I use this gift card?
      </h3>
      <ul className="list-disc ml-5 text-gray-800 space-y-2 mb-6 text-sm">
        <li>
          EverythingCard offers a wide range of national e-gift cards including
          dining, travel, shopping, entertainment, gas, and groceries.
        </li>
        <li>
          You can split your funds (e.g. a $100 card = $25 Amazon, $25 Shoppers,
          $25 Starbucks, $25 Yorkdale).
        </li>
      </ul>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">
        How does this work?
      </h3>
      <Paragraph className="mb-4">
        You'll receive an email from <strong>“The EverythingCard.”</strong> To
        redeem:
      </Paragraph>

      <ol className="list-decimal ml-5 text-gray-800 space-y-2 mb-8 text-sm">
        <li>
          Copy the code in the email and click “CONTINUE” to access the
          Redemption Page.
        </li>
        <li>
          Click “CONTINUE” again, paste the code, and select “REDEEM NOW.”
        </li>
        <li>
          Choose your gift card(s) and value(s).
          <br />
          <em className="text-gray-600">
            Tip: Use the full amount now or redeem the rest later!
          </em>
        </li>
        <li>
          Click “NEXT STEP” (or “CONTINUE” if redirected).
          <br />
          <em className="text-gray-600">
            Note: Step 4 may be skipped automatically.
          </em>
        </li>
        <li>Enter your info and click “NEXT STEP.”</li>
        <li>Review selections, then click “CONTINUE AND PLACE YOUR ORDER.”</li>
      </ol>

      <Paragraph className="mb-10">
        <strong>That’s it!</strong> You’ll get a confirmation email with your
        gift cards — usually within minutes!
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">
        What’s in it for me?
      </h3>
      <ul className="space-y-6 text-gray-800 text-sm">
        <li>
          <strong>• One card, many choices.</strong>
          <br /> Mix and match from top brands.
        </li>
        <li>
          <strong>• Faster delivery.</strong>
          <br /> Most cards arrive within minutes (2-day max).
        </li>
        <li>
          <strong>• Safety.</strong>
          <br /> Trusted by major banks, airlines, and global companies.
        </li>
        <li>
          <strong>• Easy redemption.</strong>
          <br /> No login required. Just enter the unique code.
        </li>
        <li>
          <strong>• Anywhere redemption.</strong>
          <br /> Works seamlessly on mobile or desktop.
        </li>
        <li>
          <strong>• Smooth experience.</strong>
          <br /> Partner stores are vetted for frictionless redemption.
        </li>
        <li>
          <strong>• No expiration date.</strong>
          <br /> Redeem anytime. No “use it or lose it.”
        </li>
        <li>
          <strong>• Personalized assistance.</strong>
          <br /> Our team and EverythingCard reps are here to help.
        </li>
      </ul>
    </div>
  );
}
