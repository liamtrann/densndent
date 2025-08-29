// src/components/product/ListSubscriptions.jsx
import React from "react";
import ConfirmCancelSubscription from "common/modals/ConfirmCancelSubscription";
import { Loading, Paragraph } from "common";
import SubscriptionRow from "./SubscriptionRow";
import useSubscriptionsList from "@/hooks/useSubscriptionsList";

export default function ListSubscriptions() {
  const {
    items, loading,
    pending, pendingDate, pendingStatus,
    initialDate, initialStatus,
    savingRow, savingStatus, confirming,
    handleIntervalChange,
    handleDateChange,
    handleStatusChange,
    handleSaveAll,
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

          const intervalNow = pending[roId] ?? s.interval;
          const dateVal     = pendingDate[roId] ?? initialDate[roId];
          const statusVal   = pendingStatus[roId] ?? initialStatus[roId] ?? "active";

          const isDirtyInterval = intervalNow !== s.interval;
          const isDirtyDate     = !!dateVal && dateVal !== initialDate[roId];
          const isDirtyStatus   =
            (initialStatus[roId] ?? "active") !== (statusVal ?? "active");

          const isSavingCombined = !!savingRow[roId];

          return (
            <SubscriptionRow
              key={roId}
              s={s}
              intervalNow={intervalNow}
              dateVal={dateVal}
              statusVal={statusVal}
              isDirtyInterval={isDirtyInterval}
              isDirtyDate={isDirtyDate}
              isDirtyStatus={isDirtyStatus}
              isSavingCombined={isSavingCombined}
              onChangeInterval={handleIntervalChange}
              onChangeDate={handleDateChange}
              onChangeStatus={handleStatusChange}
              onSave={handleSaveAll}
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
