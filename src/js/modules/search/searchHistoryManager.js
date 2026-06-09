export const SearchHistoryManager = {
    MAX_HISTORY_ITEMS: 10,
    STORAGE_KEY_HISTORY: 'niypher_search_history',
    STORAGE_KEY_FREQUENCY: 'niypher_search_frequency',

    loadHistory: function() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY_HISTORY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    },

    loadFrequency: function() {
        try {
            const freq = localStorage.getItem(this.STORAGE_KEY_FREQUENCY);
            return freq ? JSON.parse(freq) : {};
        } catch (e) {
            return {};
        }
    },

    saveHistory: function(history) {
        try {
            localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(history));
        } catch (e) {
        }
    },

    saveFrequency: function(frequency) {
        try {
            localStorage.setItem(this.STORAGE_KEY_FREQUENCY, JSON.stringify(frequency));
        } catch (e) {
        }
    },

    addQuery: function(query, history, frequency) {
        if (!query || query.trim().length === 0) {
            return { history, frequency };
        }

        query = query.trim();

        const newHistory = history.filter(h => h !== query);
        newHistory.unshift(query);
        if (newHistory.length > this.MAX_HISTORY_ITEMS) {
            newHistory.length = this.MAX_HISTORY_ITEMS;
        }

        const newFrequency = { ...frequency };
        newFrequency[query] = (newFrequency[query] || 0) + 1;

        return { history: newHistory, frequency: newFrequency };
    },

    removeQuery: function(query, history, frequency) {
        if (!query) {
            return { history, frequency };
        }

        const newHistory = history.filter(h => h !== query);
        const newFrequency = { ...frequency };
        delete newFrequency[query];

        return { history: newHistory, frequency: newFrequency };
    }
};
