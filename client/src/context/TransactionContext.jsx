import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

// 1. Create the context
const TransactionContext = createContext();

// 2. Create a custom hook for easy access
export const useTransactions = () => {
    return useContext(TransactionContext);
};

// 3. Create the provider component
export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authState } = useAuth();

    // Function to fetch all transactions from the backend
    const fetchTransactions = useCallback(async () => {
        if (!authState.token) return; // Don't fetch if not logged in

        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/transactions');
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load transaction data.');
        } finally {
            setLoading(false);
        }
    }, [authState.token]);

    // Fetch transactions when the user logs in
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // The value provided to consuming components
    const value = {
        transactions,
        loading,
        error,
        refetchTransactions: fetchTransactions, // Expose the fetch function to allow manual refresh
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};