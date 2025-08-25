// src/hooks/useOrderDetails.js
import { useEffect, useState } from "react";
import api from "api/api";
import endpoint from "api/endpoints";
import { normalizeOrderLine, toNum, round2 } from "config/config";

export default function useOrderDetails({ transactionId, userId, getAccessTokenSilently }) {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!transactionId || !userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently?.();
        const url = endpoint.GET_ORDER_DETAILS_BY_TRANSACTION({ transactionId, userId });
        const res = await api.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const rows = res.data?.items || res.data || [];
        const normalized = rows.map((row) => {
          const base = normalizeOrderLine(row); // { lineId, sku, name, quantity, rate, amount, image }
          const quantity = Math.abs(toNum(base.quantity));
          const rate = Math.abs(toNum(base.rate));
          const amount = Math.abs(toNum(base.amount)) || round2(quantity * rate);
          return { ...base, quantity, rate, amount };
        });

        if (mounted) setLines(normalized);
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.error || err?.message || "Failed to load order details"
          );
          setLines([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [transactionId, userId, getAccessTokenSilently]);

  return { lines, loading, error };
}
