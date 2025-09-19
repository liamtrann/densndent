import LegalLayout from "./LegalLayout";

export default function TermsRefund() {
  return (
    <LegalLayout
      title="Terms & Conditions / Refund Policy"
      updated="February 25, 2021"
    >
      <p className="mb-5">
        To place an order with an Account Coordinator, please call{" "}
        <a href="tel:18664499998" className="text-blue-700 hover:underline">
          1.866.449.9998
        </a>{" "}
        or email{" "}
        <a
          href="mailto:orders@densndente.ca"
          className="text-blue-700 hover:underline"
        >
          orders@densndente.ca
        </a>
        . Dens ‘N Dente Inc. (“Dens ‘N Dente Healthcare”) maintains a website
        located at <span className="whitespace-nowrap">www.densndente.ca</span>{" "}
        (the “Site”).
      </p>

      <p className="mb-8">
        You agree that the terms and conditions hereinafter shall govern the
        relationship between you and Dens ‘N Dente Healthcare. You acknowledge
        and accept all terms and conditions by placing an order for goods with
        Dens ‘N Dente Healthcare.
      </p>

      {/* ---------- Commerce Terms ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Acceptance
        </h2>
        <p>
          All orders received by Dens ‘N Dente Healthcare are subject to final
          acceptance or confirmation by Dens ‘N Dente Healthcare. No orders
          placed are binding upon Dens ‘N Dente Healthcare until so accepted.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment and Charges
        </h2>
        <p className="mb-3">
          <strong>
            FULL PAYMENT IS DUE ON OR BEFORE THE ORDER SHIPMENT DATE.
          </strong>{" "}
          Only the cost of missing or defective items may be delayed from full
          payment.
        </p>
        <p>
          If you require payment terms, please contact our Customer Service team
          at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>{" "}
          to discuss options.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Shipping Charges
        </h2>
        <p className="mb-3">
          Shipping and handling charges may apply to your order. Please contact
          your Account Coordinator or our Customer Service team at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>{" "}
          to confirm shipping and handling rates. Dens ‘N Dente Healthcare is
          not responsible for delays in delivery due to causes, directly or
          indirectly, beyond our reasonable control.
        </p>
        <p>
          Orders are normally processed and shipped within twenty-four (24)
          hours of receipt. Delivery is normally the next day or within two days
          of an order being shipped. Due to the COVID-19 pandemic, orders may
          take an additional 3–6 business days to fulfil and shipment times may
          be delayed.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cancellation
        </h2>
        <p>
          Special order items or options, including, but not limited to custom
          cabinetry, upholstery, and color changes cannot be cancelled. Certain
          special order items may be cancelled subject to a 20% restocking fee.
          Please contact your Account Coordinator or our Customer Service team
          at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>{" "}
          for more information.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Prices</h2>
        <p>
          Unless otherwise indicated, prices displayed on the Site are quoted in
          Canadian Dollars. Prices are subject to change at any time and without
          notice. Price increases may be passed on in the event of manufacturer
          or supplier price increases, currency exchange rate fluctuations, and
          extraordinary circumstances.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Warranties</h2>
        <p>
          Items are covered by manufacturer warranties exclusively. There are no
          other warranties, guarantees or representations, expressed or implied
          on items listed on the Site.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Returns</h2>
        <p className="mb-3">
          If you receive a defective product or one that does not perform
          satisfactorily, Dens ‘N Dente Healthcare will provide a credit,
          exchange, or refund. Items must be returned within thirty (30) days of
          receipt of your order in order to qualify. To arrange a return, please
          contact your Account Coordinator or our Customer Service team at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>
          .
        </p>
        <p className="mb-3">
          Please check your order immediately upon receipt. If there is any
          damage in transit or issues with your order, contact us within three
          (3) business days of receipt at the email above.
        </p>
        <p className="mb-3">
          In the event that you have received wrong, damaged, or defective
          items, Dens ‘N Dente will arrange for a pick-up to exchange your items
          at no additional cost. Outside of returns for wrong, damaged, or
          defective items, you are responsible for all shipping costs to return
          an order to Dens ‘N Dente Healthcare.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          The following items are not eligible for a return:
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Opened handpieces and small equipment</li>
          <li>
            Special order items that are not ordinarily in stock (including
            custom ordered stock)
          </li>
          <li>Expired products</li>
          <li>Opened hardware or software</li>
          <li>Personalized items</li>
          <li>Items that cannot be returned to the manufacturer</li>
          <li>Personal protective equipment</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Taxes</h2>
        <p className="mb-3">
          Taxes are charged based on applicable federal, provincial, and
          harmonized sales tax rates. The prices quoted on the Site do not
          include any taxes. Where required, taxes will also be applied to the
          shipping and handling charges.
        </p>
        <p className="mb-3">
          If you return an item for a refund, you will also receive a refund for
          the sales tax applicable to the refund amount. You will not receive a
          refund for the sales taxes paid on the shipping and handling of an
          item because the shipping and handling charges are non-refundable once
          an item has shipped.
        </p>
        <p>
          If you are making a purchase for a tax-exempt organization or are an
          individual that qualifies for a tax exemption, please contact our
          Customer Service team at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>
          . To ensure compliance with provincial and federal tax laws, all
          requested forms and information must be received and verified before a
          tax refund can be processed.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Gift Cards</h2>
        <p>
          If an order qualifies for a gift card and part of the order is
          returned, the value of the gift card will be deducted from the amount
          of the refund or you may order additional items to meet the threshold
          to qualify for the gift card.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Equipment Orders
        </h2>
        <p className="mb-3">
          A deposit of twenty-five percent (25%) is required for all equipment
          orders. The balance of payment is due upon delivery of the equipment.
          Dens ‘N Dente Healthcare retains title of the items until the order is
          paid in full. The purchaser assumes all the risks related to the items
          once they have been delivered. It is the purchaser’s responsibility to
          have all necessary insurance in place prior to delivery and
          installation.
        </p>
        <p className="mb-3">
          Dens ‘N Dente Healthcare can arrange for installation for a fee. All
          pre-installation requirements must be met before the installation can
          take place (e.g., construction, plumbing, electrical, permits). We
          reserve the right to charge extra for work during evenings, weekends
          or statutory holidays, and for installations outside our regular
          service area. Labour is warranted for sixty (60) days from
          installation date unless otherwise stated.
        </p>
        <p>
          Please contact your Account Coordinator or our Customer Service team
          at{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>{" "}
          to discuss equipment orders and installation fees.
        </p>
      </section>

      {/* ---------- Website Terms of Use ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Website Terms of Use
        </h2>

        <h3 className="text-lg font-semibold mt-4 mb-1">Website Use</h3>
        <p className="mb-3">
          The Site is provided to you subject to your compliance with our terms
          and conditions of use (“Terms and Conditions”). By accessing or using
          the Site you agree to be bound by these Terms and Conditions. Please
          do not access or use the Site if you do not agree to be bound by these
          Terms and Conditions.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          Modifications to the Terms and Conditions
        </h3>
        <p className="mb-3">
          Dens ‘N Dente Healthcare reserves the right to change these Terms and
          Conditions at any time and your continued access or use of the Site
          after such changes indicates your acceptance of the Terms and
          Conditions as modified. It is your responsibility to review these
          Terms and Conditions periodically for changes.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Site Transactions</h3>
        <p className="mb-3">
          Dens ‘N Dente Healthcare reserves the right to refuse any order you
          place with us. We may, in our sole discretion, limit or cancel
          quantities purchased per person or per order. These restrictions
          include orders placed by or under the same customer account, the same
          credit card, and/or orders that use the same billing and/or shipping
          address. In the event we make a change to or cancel an order, we will
          attempt to notify you using the contact details provided at purchase.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Security</h3>
        <p className="mb-3">
          You are responsible for maintaining the confidentiality of your login
          credentials and are entirely responsible for all activities that occur
          under those credentials. You agree to (1) exit from your account at
          the end of each session, and (2) immediately notify Dens ‘N Dente
          Healthcare of any unauthorized use or any other breach of security.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Viruses</h3>
        <p className="mb-3">
          Accessing this Site and the information, data, and other materials
          (the “Content”) is done at your own risk. We cannot and do not
          guarantee that the Site or Content will be free from viruses or other
          destructive code. You are responsible for implementing safeguards and
          for any costs associated with service, repairs, or connections to your
          computer system arising from your use of the Site.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          Personal Information Submitted Through the Site
        </h3>
        <p className="mb-3">
          Your submission of personal information through the Site is governed
          by our{" "}
          <a href="/privacy-policy" className="text-blue-700 hover:underline">
            Privacy Policy
          </a>
          .
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          Third-Party Websites
        </h3>
        <p className="mb-3">
          The Site may provide links to third-party websites. Dens ‘N Dente
          Healthcare does not endorse, control, or guarantee the information on
          those websites. Access is at your own risk.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Disclaimer</h3>
        <p className="mb-3">
          THE SITE AND CONTENT ARE PROVIDED “AS IS” WITHOUT WARRANTY OR
          CONDITION OF ANY KIND. USE OF THE SITE OR THE CONTENT IS AT YOUR OWN
          RISK. DENS ‘N DENTE HEALTHCARE DOES NOT MAKE ANY REPRESENTATIONS,
          WARRANTIES, OR CONDITIONS ABOUT THE QUALITY, ACCURACY, RELIABILITY,
          COMPLETENESS, CURRENCY OR TIMELINESS OF THE SITE OR THE CONTENT.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          Limitation of Liability
        </h3>
        <p className="mb-3">
          TO THE FULLEST EXTENT PERMITTED BY LAW, DENS ‘N DENTE HEALTHCARE
          DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE SITE AND
          THE CONTENT. IN NO EVENT WILL DENS ‘N DENTE HEALTHCARE BE LIABLE FOR
          ANY DAMAGES OF ANY KIND, WHETHER OR NOT ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES, RESULTING FROM THE USE OF, OR THE INABILITY TO MAKE USE
          OF, THE SITE OR CONTENT.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          Errors, Inaccuracies, and Omissions
        </h3>
        <p className="mb-3">
          Although reasonable care is taken to ensure the Content is accurate
          and up to date, typographical and other errors may occur. We reserve
          the right to modify, delete, and rearrange any or all of the Content
          or Site at any time without notice.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Indemnification</h3>
        <p className="mb-3">
          You agree to defend, indemnify, and hold harmless Dens ‘N Dente
          Healthcare and its affiliates from all liabilities, claims, damages,
          and expenses (including legal fees) that arise from your use or misuse
          of the Site and Content.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">
          No Unlawful or Prohibited Use
        </h3>
        <p className="mb-3">
          Except as expressly provided, any reproduction, retransmission,
          distribution, sale, republication, modification, reverse engineering,
          or other exploitation of the Site or Content is strictly prohibited.
          You agree not to use the Site for any unlawful purpose.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Ownership</h3>
        <p className="mb-3">
          All Content, designs, graphics, software, artwork, media, names,
          phrases, logos and marks displayed on the Site are owned by Dens ‘N
          Dente Healthcare and protected by intellectual property laws.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Governing Law</h3>
        <p className="mb-3">
          These Terms and Conditions are governed by the laws of the Province of
          Ontario and applicable laws of Canada. The Site and Content are
          intended for use only in jurisdictions where they may lawfully be
          offered.
        </p>
      </section>

      {/* ---------- Accessibility / Language / General ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Accessibility
        </h2>
        <p className="mb-3">
          We are committed to making our Site and Content accessible to
          customers who use screen readers and other assistive technologies. If
          you have questions or would like to make a purchase, please call{" "}
          <a href="tel:18664499998" className="text-blue-700 hover:underline">
            1.866.449.9998
          </a>{" "}
          or contact{" "}
          <a
            href="mailto:orders@densndente.ca"
            className="text-blue-700 hover:underline"
          >
            orders@densndente.ca
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Choice of Language
        </h2>
        <p className="mb-3">
          The parties hereto confirm that it is their wish that the Terms and
          Conditions, as well as other documents relating hereto including
          notices, have been and shall be drawn up in the English language only.
          Les parties aux présentes confirment leur volonté que les termes et
          conditions de même que tous les documents, y compris tout avis qui
          s&apos;y rattache, soient rédigés en langue anglaise.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          General Provisions
        </h2>
        <p>
          These Terms and Conditions constitute the entire agreement between
          Dens ‘N Dente Healthcare and you pertaining to the subject matter
          hereof and supersede all prior communications. If any provision is
          determined to be invalid or unenforceable, the remaining provisions
          shall remain in full force and effect.
        </p>
      </section>
    </LegalLayout>
  );
}
