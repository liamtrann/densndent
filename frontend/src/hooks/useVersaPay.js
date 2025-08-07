// src/hooks/useVersaPay.js
import { useState, useEffect } from 'react';
import versaPayService from '../services/versaPayService';

export const useVersaPay = (orderData, options = {}) => {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        createSession();
    }, []);

    const createSession = async () => {
        try {
            setLoading(true);
            setError(null);

            // Create session with VersaPay
            const sessionOptions = {
                ...options,
                // Add any specific options based on your needs
            };

            const id = await versaPayService.createSession(sessionOptions);
            setSessionId(id);
        } catch (err) {
            console.error('Failed to create VersaPay session:', err);
            setError(err.message || 'Failed to initialize payment system');
        } finally {
            setLoading(false);
        }
    };

    const refreshSession = async () => {
        await createSession();
    };

    return {
        sessionId,
        loading,
        error,
        refreshSession
    };
};
