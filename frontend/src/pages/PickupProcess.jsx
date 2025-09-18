import LegalLayout from "./LegalLayout";

export default function PickupProcess() {
  return (
    <LegalLayout title="Pick Up Process">
      <p className="italic text-gray-600">
        *Once your order is placed, you will receive an email when your order is
        ready for pick up*
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        How does curbside pick-up work?
      </h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>
          Build your shopping cart and proceed to checkout. For your delivery
          method select <strong>pickup option</strong>. Proceed by choosing the{" "}
          location you would like to pick up your order from.{" "}
          <span className="whitespace-nowrap">
            (We are located in Richmond Hill, Ontario.)
          </span>
        </li>
        <li>
          After completing your payment, you will receive a{" "}
          <strong>confirmation email</strong>.
        </li>
        <li>
          Dens ‘N Dente requires <strong>24–48 hours</strong> to complete your
          order. You must receive an email to inform you when your order is
          ready to be picked up.{" "}
          <strong>Please do not head to the location</strong> without an email
          confirmation.
        </li>
        <li>
          When arriving to pick up, have your{" "}
          <strong>confirmation letter/order number</strong> and a{" "}
          <strong>piece of ID</strong> prepared.
        </li>
      </ol>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
        Order Pick Up Address &amp; Hours
      </h2>
      <div className="rounded border border-blue-100 bg-blue-50 p-4 space-y-2">
        <p className="uppercase tracking-wide font-semibold">
          Proceed to the back of the building — Dens ‘N Dente dock door — ring
          the door bell
        </p>
        <address className="not-italic">
          <div>
            <strong>Address:</strong> 91 Granton Drive, Richmond Hill ON, L4B
            2N5
          </div>
          <div>
            <strong>Hours for pickup:</strong> Monday to Friday (9:30AM –
            4:30PM)
          </div>
        </address>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">
        When can I expect my order to be ready for pick-up?
      </h3>
      <p>
        Normally it takes <strong>24–48 hours</strong> (business days). However,
        due to the pandemic, there may be times of delay.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
        How will I know my order is ready for pick-up?
      </h3>
      <p>
        You will receive an email from{" "}
        <a href="mailto:info@densndente.ca" className="text-blue-700 underline">
          info@densndente.ca
        </a>{" "}
        confirming when your order is ready to be picked up.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
        Am I required to show proof of order?
      </h3>
      <p>
        Yes. You are required to show the{" "}
        <strong>confirmation letter/order number</strong> and a{" "}
        <strong>piece of ID</strong> to pick up your order.
      </p>
    </LegalLayout>
  );
}
