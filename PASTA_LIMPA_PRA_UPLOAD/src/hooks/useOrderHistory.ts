import { useState, useEffect } from 'react';

export interface OrderRecord {
    id: string;
    date: string;
    supplierName: string;
    items: string; // Summary of items
    totalItems: number;
}

const STORAGE_KEY = 'vigi_order_history';

export function useOrderHistory() {
    const [history, setHistory] = useState<OrderRecord[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const addOrder = (supplierName: string, itemsSummary: string, totalCount: number) => {
        const newOrder: OrderRecord = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            supplierName,
            items: itemsSummary,
            totalItems: totalCount
        };

        setHistory(prev => {
            const updated = [newOrder, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return { history, addOrder, clearHistory };
}
