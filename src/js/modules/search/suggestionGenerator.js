import { chineseToPinyin, getFirstLetters, fuzzyMatch } from '../foundation/utils.js';
import { SearchIndex } from './searchIndex.js';

export const SuggestionGenerator = {
    generateSuggestions: function(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        if (!query || query.length === 0) {
            return results;
        }

        const seen = new Set();
        const indexResults = SearchIndex.search(query);

        indexResults.forEach(result => {
            const game = SearchIndex.getGameById(result.id);
            if (!game) {
                return;
            }

            this._addGameSuggestion(game, result, results, seen);
            this._addTagSuggestions(game, lowerQuery, results, seen);
            this._addDeveloperSuggestion(game, lowerQuery, results, seen);
            this._addVndbSuggestion(game, lowerQuery, results, seen);
        });

        const uniqueResults = this._removeDuplicates(results);
        uniqueResults.sort((a, b) => b.score - a.score);

        return uniqueResults;
    },

    _addGameSuggestion: function(game, result, results, seen) {
        const displayTitle = game.title + (game.titleEn ? ` (${game.titleEn})` : '');
        const resultKey = `${displayTitle}-game`;

        if (!seen.has(resultKey)) {
            results.push({
                text: displayTitle,
                type: 'game',
                score: result.score,
                id: game.id,
                vndbId: game.vndbId,
                developer: game.developer,
                isFuzzy: result.isFuzzy || false
            });
            seen.add(resultKey);
        }
    },

    _addTagSuggestions: function(game, lowerQuery, results, seen) {
        game.tags.forEach(tag => {
            const tagKey = `${tag}-tag`;
            if (seen.has(tagKey)) {
                return;
            }

            const tagScore = this._calculateTagScore(tag, lowerQuery);

            if (tagScore > 0) {
                results.push({
                    text: tag,
                    type: 'tag',
                    score: tagScore,
                    id: game.id
                });
                seen.add(tagKey);
            }
        });
    },

    _calculateTagScore: function(tag, lowerQuery) {
        const tagLower = tag.toLowerCase();
        const tagPinyin = chineseToPinyin(tag);
        const tagFirst = getFirstLetters(tag);
        let tagScore = 0;

        if (tagLower.includes(lowerQuery)) {
            tagScore = 80;
        }

        if (tagPinyin.includes(lowerQuery)) {
            tagScore = Math.max(tagScore, 70);
        }

        if (tagFirst.includes(lowerQuery)) {
            tagScore = Math.max(tagScore, 65);
        }

        if (fuzzyMatch(tagFirst, lowerQuery)) {
            tagScore = Math.max(tagScore, 55);
        }

        return tagScore;
    },

    _addDeveloperSuggestion: function(game, lowerQuery, results, seen) {
        if (!game.developer || seen.has(`${game.developer}-developer`)) {
            return;
        }

        const devScore = this._calculateDeveloperScore(game.developer, lowerQuery);

        if (devScore > 0) {
            results.push({
                text: game.developer,
                type: 'developer',
                score: devScore,
                id: game.id
            });
            seen.add(`${game.developer}-developer`);
        }
    },

    _calculateDeveloperScore: function(developer, lowerQuery) {
        const devLower = developer.toLowerCase();
        const devPinyin = chineseToPinyin(developer);
        const devFirst = getFirstLetters(developer);
        let devScore = 0;

        if (devLower.includes(lowerQuery)) {
            devScore = 75;
        }

        if (devPinyin.includes(lowerQuery)) {
            devScore = Math.max(devScore, 65);
        }

        if (devFirst.includes(lowerQuery)) {
            devScore = Math.max(devScore, 60);
        }

        return devScore;
    },

    _addVndbSuggestion: function(game, lowerQuery, results, seen) {
        if (!game.vndbId || seen.has(`${game.vndbId}-vndb`)) {
            return;
        }

        if (game.vndbId.toLowerCase().includes(lowerQuery)) {
            results.push({
                text: `VNDB: ${game.vndbId}`,
                type: 'vndb',
                score: 70,
                id: game.id,
                vndbId: game.vndbId
            });
            seen.add(`${game.vndbId}-vndb`);
        }
    },

    _removeDuplicates: function(results) {
        const seen = new Set();
        return results.filter(item => {
            const key = `${item.text}-${item.type}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
};
