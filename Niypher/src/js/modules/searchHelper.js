
export function parseSearchParams() {
    return new URLSearchParams(window.location.search);
}

export function serializeSearchParams(params) {
    return new URLSearchParams(params).toString();
}

export function processResults(results, sortKey, filterType, order = 'desc', recommendScores = null, searchScores = null) {
    let processed = [...results];

    if (filterType) {
        processed = processed.filter(item => {
            return item.tags && item.tags.includes(filterType);
        });
    }

    if (!sortKey && recommendScores && searchScores) {
        processed.sort((a, b) => {
            const scoreA = (searchScores.get(a.id) || 0) * 0.7 + (recommendScores.get(a.id) || 0) * 0.3;
            const scoreB = (searchScores.get(b.id) || 0) * 0.7 + (recommendScores.get(b.id) || 0) * 0.3;
            return scoreB - scoreA;
        });
        return processed;
    }

    if (sortKey) {
        const isAsc = order === 'asc';
        processed.sort((a, b) => {
            if (sortKey === 'title') {
                const comparison = a.title.localeCompare(b.title, 'zh-CN');
                return isAsc ? comparison : -comparison;
            } else if (sortKey === 'date') {
                if (a.versions && a.versions.length > 0 && b.versions && b.versions.length > 0) {
                    const dateA = new Date(a.versions[0].date);
                    const dateB = new Date(b.versions[0].date);
                    return isAsc ? dateA - dateB : dateB - dateA;
                }
            }
            return 0;
        });
    }

    return processed;
}
