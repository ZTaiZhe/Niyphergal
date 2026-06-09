export const HotSearchManager = {
    MAX_HOT_SEARCHES: 5,

    calculateHotSearches: function(frequency) {
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.MAX_HOT_SEARCHES)
            .map(([term]) => term);
    },

    getHotSearches: function(frequency, history) {
        const hotSearches = this.calculateHotSearches(frequency);
        return hotSearches.filter(h => !history.includes(h));
    }
};
