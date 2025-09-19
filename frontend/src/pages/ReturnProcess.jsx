import LegalLayout from "./LegalLayout";

export default function ReturnProcess() {
  return (
    <LegalLayout title="Web Store Return Process">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Dens &#39;N Dente Refund Process
      </h2>

      <ol className="list-decimal pl-6 space-y-3">
        <li>
          After an RMA is created from the website, please print a copy and
          place it inside the box. If you are returning a total of <em>X</em>{" "}
          boxes, then <strong>each box</strong> is required to have a copy of
          the RMA.
        </li>
        <li>
          Please allow <strong>1–2 business days</strong> for a customer service
          representative to contact you by email/phone to schedule a pick-up
          date for your parcels. After confirmation of the pick-up date, your
          return will be picked up by <strong>ICS Courier</strong>.
        </li>
      </ol>

      <div className="mt-6 p-4 rounded border border-blue-100 bg-blue-50">
        <p className="m-0">
          <strong>Drop-off option:</strong> If you wish to drop off at our
          office, our address is{" "}
          <span className="whitespace-nowrap">
            91 Granton Dr, Richmond Hill
          </span>
          . Please ensure a copy of the RMA is inside the box or we will not be
          able to process the refund accordingly.
        </p>
      </div>
    </LegalLayout>
  );
}
