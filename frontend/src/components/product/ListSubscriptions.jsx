// src/components/product/ListSubscriptions.jsx
import ConfirmCancelSubscription from "common/modals/ConfirmCancelSubscription";
import React from "react";

import { Loading, Paragraph } from "common";

import SubscriptionRow from "./SubscriptionRow";

import useSubscriptionsList from "@/hooks/useSubscriptionsList";

export default function ListSubscriptions() {
  const {
    items,
    loading,
    savingRow,
    savingStatus,
    confirming,
    handleSaveSubscription,
    performCancel,
    setConfirming,
  } = useSubscriptionsList();

  if (loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <Loading />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No active subscriptions
        </h3>
        <Paragraph className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </Paragraph>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((s) => {
          const roId = s.roId;
          const isSaving = !!savingRow[roId];

          // Create initial data object for React Hook Form
          const initialData = {
            interval: s.interval || "1",
            date: s.nextrun || "",
            status: s.status || "active",
            deliveryDays: s.deliveryDays || [],
          };

          return (
            <SubscriptionRow
              key={roId}
              s={s}
              initialData={initialData}
              onSave={handleSaveSubscription}
              isSaving={isSaving}
            />
          );
        })}
      </div>

      {/* Confirmation Modal for "Cancel subscription" */}
      <ConfirmCancelSubscription
        open={!!confirming}
        productTitle={confirming?.displayname || confirming?.itemid}
        loading={confirming ? !!savingStatus[confirming.roId] : false}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && performCancel(confirming)}
      />
    </>
  );
}
