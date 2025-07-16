import { useState } from "react";

import api from "api/api";
import endpoint from "api/endpoints";

export default function useInventoryCheck() {
    const [inventoryStatus, setInventoryStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkInventory = async (ids) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post(endpoint.POST_CHECK_INVENTORY(), { ids });
            setInventoryStatus(res.data.items || []);
            return res.data.items || [];
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to check inventory");
            setInventoryStatus([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { inventoryStatus, loading, error, checkInventory };
}
