import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import Paragraph from "../common/Paragraph";

export default function GiftCardProgramPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb path={["Home", "Promotions & Catalogues", "DND Gift Card Program"]} />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight">
          THE GIFT CARD PROGRAM
        </h1>
      </div>

      {/* Intro */}
      <Paragraph className="text-lg text-gray-800 mb-4">
        Our Gift Card Program was designed to express our gratitude for your loyalty and support.
        It’s our way of saying, <strong>“Thank you for choosing Dens ‘N Dente Healthcare!”</strong>
      </Paragraph>

      <Paragraph className="text-md text-gray-800 mb-6">
        To better serve our customer’s needs, we offer <strong>two</strong> options:
      </Paragraph>

      {/* Gift Card Options */}
      <ul className="list-disc ml-5 text-md text-gray-800 space-y-4 mb-8">
        <li>
          <strong>The Everything E-gift Card:</strong> A versatile digital option that can be used
          across multiple stores, perfect for convenient shopping.
        </li>
        <li>
          <strong>The DND Gift Card:</strong> A practical credit that can be applied to your next
          order, allowing you to save even more on your purchases with Dens ‘N Dente!
        </li>
      </ul>

      <p className="italic text-orange-600 font-semibold mb-10">
        Discover more about these exciting options below and choose the one that fits your needs best!
      </p>

      {/* Gift Card Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border border-gray-300 text-sm font-semibold">
                Order Amount<br /><span className="text-xs italic">*excluding taxes</span>
              </th>
              <th className="py-3 px-4 border border-gray-300 text-sm font-semibold">E-GIFT CARD</th>
              <th className="py-3 px-4 border border-gray-300 text-sm font-semibold">DND GIFT CARD</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {[
              { amount: "$300", egift: "$25", dnd: "$35" },
              { amount: "$500", egift: "$50", dnd: "$60" },
              { amount: "$1,000", egift: "$100", dnd: "$125" },
              { amount: "$2,000", egift: "$200", dnd: "$250" },
              { amount: "$5,000", egift: "$500", dnd: "$625" },
              { amount: "$10,000", egift: "$1,000", dnd: "$1,250" },
            ].map(({ amount, egift, dnd }) => (
              <tr key={amount}>
                <td className="py-3 px-4 border border-gray-300">{`Spend ${amount}`}</td>
                <td className="py-3 px-4 border border-gray-300">{egift}</td>
                <td className="py-3 px-4 border border-gray-300">{dnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Disclaimer */}
      <p className="text-sm text-orange-600 font-semibold mt-6">
        Choose between the E-Gift Card and the DND Gift Card and receive the specified gift card amount when your order meets the qualifying purchase threshold listed above.
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Disclaimer: Other order amounts do also qualify. For more details, please contact our sales representatives.
      </p>

      {/* --------------------------- */}
      {/* E-Gift Card Section */}
      {/* --------------------------- */}
      <h2 className="text-2xl font-bold text-smiles-blue mt-12 mb-4">THE E-GIFT CARD</h2>
      <Paragraph className="text-gray-800 mb-6">
        The e-gift cards are provided by EverythingCard, Canada’s #1 corporate gifting platform,
        proudly made and serviced in Canada. Trusted by prominent organizations across various
        industries, including the University of Toronto, Emirates, RBC, and Toyota, the
        EverythingCard delivers a convenient and versatile gifting solution.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">Where can I use this gift card?</h3>
      <ul className="list-disc ml-5 text-gray-800 space-y-2 mb-6">
        <li>
          EverythingCard offers an exciting selection of national e-gift card options,
          including dining, travel, shopping, entertainment, gas, and grocery.
        </li>
        <li>
          Customers can split the available funds across multiple merchants (e.g., a $100 gift card
          could be redeemed for $25 Amazon, $25 Shoppers Drug Mart, $25 Starbucks and $25 Yorkdale Mall).
        </li>
      </ul>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">How does this work?</h3>
      <Paragraph className="mb-4">
        You will receive an email from <strong>“The EverythingCard.”</strong> Follow these steps:
      </Paragraph>
      <ol className="list-decimal ml-5 text-gray-800 space-y-2 mb-8">
        <li>Copy the code provided in the email and click <strong>“CONTINUE”</strong>.</li>
        <li>Click <strong>“CONTINUE”</strong> again. Paste the code and click <strong>“REDEEM NOW.”</strong></li>
        <li>Click <strong>“CHOOSE GIFT CARD”</strong> and select the brand and amount.</li>
        <li>Click <strong>“NEXT STEP”</strong> or <strong>“CONTINUE”</strong> if prompted.</li>
        <li>Enter your info, then click <strong>“NEXT STEP.”</strong></li>
        <li>Review and click <strong>“CONTINUE AND PLACE YOUR ORDER.”</strong></li>
      </ol>

      <Paragraph className="mb-10">
        <strong>That’s it!</strong> Your e-gift card(s) will arrive in your inbox within 2 business days — often sooner!
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">What’s in it for me?</h3>
      <ul className="space-y-6 text-gray-800 text-sm">
        {[
          ["One card, many choices.", "You can choose your gift card from various leading brands and mix and match."],
          ["Faster delivery.", "Gift cards are delivered within 2 business days or even minutes."],
          ["Safety.", "Digital gift cards are secure and trusted by major brands."],
          ["Easy and intuitive redemption process.", "Just use your code—no account or password needed."],
          ["Anywhere redemption.", "Compatible with mobile and desktop."],
          ["Smooth experience.", "All partner stores ensure a seamless process."],
          ["No expiration date.", "Use it whenever you want—no pressure."],
          ["Personalized assistance.", "Our team and EverythingCard reps are ready to help."]
        ].map(([title, text]) => (
          <li key={title}>
            <p><strong>• {title}</strong><br />{text}</p>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <hr className="my-12 border-t" />

      {/* --------------------------- */}
      {/* DND Gift Card Section */}
      {/* --------------------------- */}
      <h2 className="text-2xl font-bold text-smiles-blue mb-4">THE DND GIFT CARD</h2>
      <Paragraph className="text-gray-800 mb-6">
        The Dens ‘N Dente Healthcare (DND) Gift Card was created to help clinics save on future purchases
        while reinvesting into high-quality, tailored products. Earned credit can be applied to your next order—
        building a continuous cycle of savings and success.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">Where can I use this gift card?</h3>
      <Paragraph className="mb-6">• The DND Gift Card can only be used with Dens ‘N Dente.</Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-2 uppercase">How does this work?</h3>
      <Paragraph className="mb-4">
        The DND Gift Card is a credit applied to your account and redeemed on your next call-in order.
        Simply notify your Sales Rep when you're ready to apply it.
      </Paragraph>
      <Paragraph className="italic text-sm text-gray-600 mb-6">
        Note: The DND Gift Card is valid for use only on call-in orders.
      </Paragraph>

      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">What’s in it for me?</h3>
      <ul className="space-y-6 text-gray-800 text-sm">
        {[
          ["Higher Value, Greater Benefit.", "Compared to the e-gift card, the DND card offers more value back on future purchases."],
          ["Tailored for Your Clinic’s Needs.", "You're reinvesting in trusted, handpicked products suited to your workflow."],
          ["Personalized Support from our Sales Reps.", "We help guide you to get the most out of your reward and clinic spend."],
          ["Ongoing Rewards for Future Savings:", "Earn new gift cards as you continue to shop, forming a cycle of cost-effective reordering."]
        ].map(([title, text]) => (
          <li key={title}>
            <p><strong>• {title}</strong><br />{text}</p>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <hr className="my-12 border-t" />

      {/* Support Note */}
      <div className="bg-smiles-blue text-white font-semibold py-3 px-6 rounded-lg mb-6 text-center text-md">
        Need assistance? Give us a call — we’re here and happy to help!
      </div>

      {/* Rules & Requirements */}
      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">Gift Card Rules & Qualification Requirements:</h3>
      <ol className="list-decimal ml-6 text-gray-800 space-y-2 text-sm mb-6">
        <li>Applies exclusively to call-in orders. Website orders are not eligible.</li>
        <li>
          Applies only to regular-priced products and vendor promotions. Items must be full price unless part of a vendor deal.
        </li>
        <li>Not applicable to custom or special-order items.</li>
        <li>Not applicable to large or mid-size equipment.</li>
        <li>Cannot be combined with any past or future orders.</li>
        <li>The order must be paid fully by credit card.</li>
      </ol>

      <p className="text-sm text-gray-700 mb-2">
        If an order qualifies for a gift card and is partially or fully canceled, the gift card value will be adjusted.
        If returned, the gift card value will be deducted from the refund. You may also add items to maintain your eligibility.
      </p>
      <p className="text-sm text-gray-700">
        Please note that the Gift Card Program and its policy are subject to change at any time without prior notice.
      </p>
    </div>
  );
}
