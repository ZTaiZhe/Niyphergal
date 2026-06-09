/**
 *
 *
 * VNDB ID
 */

import { chineseToPinyin, getFirstLetters, fuzzyMatch, chineseToPinyinArray } from './utils.js';
import { DB } from './data.js';
import { expandFuzzyPinyin, expandFuzzyFirstLetters, FUZZY_SCORE } from './fuzzyPinyin.js';

export const SearchIndex = {
    games: [],
    index: null,
    pinyinIndex: null,
    firstLetterIndex: null,
    fuzzyPinyinIndex: null,
    fuzzyFirstLetterIndex: null,

    init: function() {
        this.importFromDB();
        this.buildIndex();
    },

    importFromDB: function() {
        this.games = DB.resources.map(resource => {
            const titleMatch = resource.title.match(/^(.+?)(?:\s*\((.+)\))?$/);
            const mainTitle = titleMatch ? titleMatch[1] : resource.title;
            const titleEn = titleMatch && titleMatch[2] ? titleMatch[2] : null;

            return {
                id: resource.id,
                title: mainTitle,
                titleEn: titleEn,
                titleJp: null,
                aliases: [resource.title, mainTitle, titleEn].filter(Boolean),
                developer: null,
                developers: [],
                vndbId: null,
                vndbRelations: [],
                tags: resource.tags || [],
                releaseDate: null,
                cover: resource.cover,
                intro: resource.intro
            };
        });
    },

    buildIndex: function() {
        this.index = new Map();
        this.pinyinIndex = new Map();
        this.firstLetterIndex = new Map();
        this.fuzzyPinyinIndex = new Map();
        this.fuzzyFirstLetterIndex = new Map();

        this.games.forEach(game => {
            const searchTerms = this.extractSearchTerms(game);

            searchTerms.forEach(term => {
                const lowerTerm = term.toLowerCase();
                if (!this.index.has(lowerTerm)) {
                    this.index.set(lowerTerm, []);
                }
                this.index.get(lowerTerm).push(game.id);
            });

            const pinyinTerms = this.extractPinyinTerms(game);
            pinyinTerms.forEach(term => {
                const lowerTerm = term.toLowerCase();
                if (!this.pinyinIndex.has(lowerTerm)) {
                    this.pinyinIndex.set(lowerTerm, []);
                }
                if (!this.pinyinIndex.get(lowerTerm).includes(game.id)) {
                    this.pinyinIndex.get(lowerTerm).push(game.id);
                }

                const fuzzyVariants = expandFuzzyPinyin(lowerTerm);
                fuzzyVariants.forEach(variant => {
                    if (!this.fuzzyPinyinIndex.has(variant)) {
                        this.fuzzyPinyinIndex.set(variant, []);
                    }
                    if (!this.fuzzyPinyinIndex.get(variant).includes(game.id)) {
                        this.fuzzyPinyinIndex.get(variant).push(game.id);
                    }
                });
            });

            const firstLetters = this.extractFirstLetters(game);
            firstLetters.forEach(term => {
                const lowerTerm = term.toLowerCase();
                if (!this.firstLetterIndex.has(lowerTerm)) {
                    this.firstLetterIndex.set(lowerTerm, []);
                }
                if (!this.firstLetterIndex.get(lowerTerm).includes(game.id)) {
                    this.firstLetterIndex.get(lowerTerm).push(game.id);
                }

                const fuzzyVariants = expandFuzzyFirstLetters(lowerTerm);
                fuzzyVariants.forEach(variant => {
                    if (!this.fuzzyFirstLetterIndex.has(variant)) {
                        this.fuzzyFirstLetterIndex.set(variant, []);
                    }
                    if (!this.fuzzyFirstLetterIndex.get(variant).includes(game.id)) {
                        this.fuzzyFirstLetterIndex.get(variant).push(game.id);
                    }
                });
            });
        });
    },

    extractSearchTerms: function(game) {
        const terms = new Set();

        if (game.title) {terms.add(game.title);}
        if (game.titleEn) {terms.add(game.titleEn);}
        if (game.titleJp) {terms.add(game.titleJp);}

        game.aliases.forEach(alias => terms.add(alias));

        if (game.developer) {terms.add(game.developer);}
        game.developers.forEach(dev => terms.add(dev));

        game.tags.forEach(tag => terms.add(tag));

        if (game.vndbId) {terms.add(game.vndbId);}

        return Array.from(terms);
    },

    extractPinyinTerms: function(game) {
        const terms = new Set();

        const addPinyin = (text) => {
            if (!text) {return;}
            const pinyin = chineseToPinyin(text);
            if (pinyin) {terms.add(pinyin);}

            const pinyinArr = chineseToPinyinArray(text);
            for (const charPinyins of pinyinArr) {
                if (Array.isArray(charPinyins)) {
                    for (const p of charPinyins) {
                        if (p && /^[a-z]{2,}$/.test(p)) {terms.add(p);}
                    }
                } else if (typeof charPinyins === 'string' && /^[a-z]{2,}$/.test(charPinyins)) {
                    terms.add(charPinyins);
                }
            }
        };

        addPinyin(game.title);
        addPinyin(game.titleEn);
        game.aliases.forEach(addPinyin);
        game.tags.forEach(addPinyin);
        if (game.developer) {addPinyin(game.developer);}
        game.developers.forEach(addPinyin);

        return Array.from(terms);
    },

    extractFirstLetters: function(game) {
        const terms = new Set();

        const addFirstLetters = (text) => {
            if (!text) {return;}
            const firstLetters = getFirstLetters(text);
            if (firstLetters) {terms.add(firstLetters);}
        };

        addFirstLetters(game.title);
        addFirstLetters(game.titleEn);
        game.aliases.forEach(addFirstLetters);
        game.tags.forEach(addFirstLetters);
        if (game.developer) {addFirstLetters(game.developer);}
        game.developers.forEach(addFirstLetters);

        return Array.from(terms);
    },

    search: function(query) {
        if (!this.index) {
            this.buildIndex();
        }

        const results = new Map();
        const fuzzyIds = new Set();
        const lowerQuery = query.toLowerCase().replace(/\s+/g, '');

        const exactKey = query.toLowerCase();
        if (this.index.has(exactKey)) {
            const gameIds = this.index.get(exactKey);
            gameIds.forEach(id => {
                results.set(id, FUZZY_SCORE.EXACT);
            });
        }

        this.index.forEach((gameIds, term) => {
            const normalizedTerm = term.replace(/\s+/g, '');
            if (normalizedTerm === lowerQuery) {
                gameIds.forEach(id => {
                    if (results.has(id)) {
                        results.set(id, Math.max(results.get(id), FUZZY_SCORE.EXACT));
                    } else {
                        results.set(id, FUZZY_SCORE.EXACT);
                    }
                });
                return;
            }
            if (normalizedTerm.includes(lowerQuery)) {
                const score = normalizedTerm.startsWith(lowerQuery) ? FUZZY_SCORE.PREFIX : FUZZY_SCORE.CONTAINS;
                gameIds.forEach(id => {
                    if (results.has(id)) {
                        results.set(id, Math.max(results.get(id), score));
                    } else {
                        results.set(id, score);
                    }
                });
            }
        });

        this.pinyinIndex.forEach((gameIds, term) => {
            const normalizedTerm = term.replace(/\s+/g, '');
            if (normalizedTerm.includes(lowerQuery)) {
                const score = normalizedTerm === lowerQuery ? 90 :
                    normalizedTerm.startsWith(lowerQuery) ? 75 : 55;
                gameIds.forEach(id => {
                    if (results.has(id)) {
                        results.set(id, Math.max(results.get(id), score));
                    } else {
                        results.set(id, score);
                    }
                });
            }
        });

        this.firstLetterIndex.forEach((gameIds, term) => {
            const normalizedTerm = term.replace(/\s+/g, '');
            if (normalizedTerm.includes(lowerQuery)) {
                const score = normalizedTerm === lowerQuery ? 85 :
                    normalizedTerm.startsWith(lowerQuery) ? 70 : 50;
                gameIds.forEach(id => {
                    if (results.has(id)) {
                        results.set(id, Math.max(results.get(id), score));
                    } else {
                        results.set(id, score);
                    }
                });
            }
        });

        this.firstLetterIndex.forEach((gameIds, term) => {
            const normalizedTerm = term.replace(/\s+/g, '');
            if (fuzzyMatch(normalizedTerm, lowerQuery)) {
                const score = 40;
                gameIds.forEach(id => {
                    if (results.has(id)) {
                        results.set(id, Math.max(results.get(id), score));
                    } else {
                        results.set(id, score);
                    }
                });
            }
        });

        const exactResultCount = results.size;
        if (exactResultCount < 5) {
            this.fuzzyPinyinIndex.forEach((gameIds, term) => {
                if (term.includes(lowerQuery)) {
                    const score = term === lowerQuery ? FUZZY_SCORE.FUZZY_EXACT :
                        term.startsWith(lowerQuery) ? FUZZY_SCORE.FUZZY_PREFIX : FUZZY_SCORE.FUZZY_CONTAINS;
                    gameIds.forEach(id => {
                        fuzzyIds.add(id);
                        if (results.has(id)) {
                            results.set(id, Math.max(results.get(id), score));
                        } else {
                            results.set(id, score);
                        }
                    });
                }
            });

            this.fuzzyFirstLetterIndex.forEach((gameIds, term) => {
                if (term.includes(lowerQuery)) {
                    const score = term === lowerQuery ? FUZZY_SCORE.FUZZY_EXACT - 5 :
                        term.startsWith(lowerQuery) ? FUZZY_SCORE.FUZZY_PREFIX - 5 : FUZZY_SCORE.FUZZY_CONTAINS - 5;
                    gameIds.forEach(id => {
                        fuzzyIds.add(id);
                        if (results.has(id)) {
                            results.set(id, Math.max(results.get(id), score));
                        } else {
                            results.set(id, score);
                        }
                    });
                }
            });

            this.fuzzyPinyinIndex.forEach((gameIds, term) => {
                if (fuzzyMatch(term, lowerQuery)) {
                    const score = FUZZY_SCORE.FUZZY_FUZZY;
                    gameIds.forEach(id => {
                        fuzzyIds.add(id);
                        if (results.has(id)) {
                            results.set(id, Math.max(results.get(id), score));
                        } else {
                            results.set(id, score);
                        }
                    });
                }
            });
        }

        return Array.from(results.entries())
            .map(([id, score]) => ({ id, score, isFuzzy: fuzzyIds.has(id) }))
            .sort((a, b) => b.score - a.score);
    },

    getGameById: function(id) {
        return this.games.find(game => game.id === id);
    },

    getGamesByDeveloper: function(developer) {
        return this.games.filter(game =>
            game.developer === developer ||
            game.developers.includes(developer)
        );
    },

    getGamesByVndbId: function(vndbId) {
        return this.games.filter(game => game.vndbId === vndbId);
    },

    getRelatedGames: function(gameId) {
        const game = this.getGameById(gameId);
        if (!game || !game.vndbRelations) {return [];}

        return game.vndbRelations.map(relation => ({
            vndbId: relation.id,
            title: relation.title,
            relation: relation.relation
        }));
    },

    addGame: function(gameData) {
        const newGame = {
            id: gameData.id || Date.now(),
            title: gameData.title,
            titleEn: gameData.titleEn || null,
            titleJp: gameData.titleJp || null,
            aliases: gameData.aliases || [],
            developer: gameData.developer || null,
            developers: gameData.developers || [],
            vndbId: gameData.vndbId || null,
            vndbRelations: gameData.vndbRelations || [],
            tags: gameData.tags || [],
            releaseDate: gameData.releaseDate || null
        };

        this.games.push(newGame);
        this.buildIndex();

        return newGame;
    },

    updateGame: function(id, updates) {
        const index = this.games.findIndex(game => game.id === id);
        if (index === -1) {return null;}

        this.games[index] = { ...this.games[index], ...updates };
        this.buildIndex();

        return this.games[index];
    },

    removeGame: function(id) {
        const index = this.games.findIndex(game => game.id === id);
        if (index === -1) {return false;}

        this.games.splice(index, 1);
        this.buildIndex();

        return true;
    },

    exportToJson: function() {
        return JSON.stringify({
            games: this.games,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        }, null, 2);
    },

    importFromJson: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.games && Array.isArray(data.games)) {
                this.games = data.games;
                this.buildIndex();
                return true;
            }
            return false;
        } catch (e) {
            console.error('导入搜索索引失败:', e);
            return false;
        }
    },

    getStats: function() {
        return {
            totalGames: this.games.length,
            totalIndexTerms: this.index ? this.index.size : 0,
            totalPinyinTerms: this.pinyinIndex ? this.pinyinIndex.size : 0,
            totalFirstLetterTerms: this.firstLetterIndex ? this.firstLetterIndex.size : 0,
            gamesWithVndb: this.games.filter(g => g.vndbId).length,
            gamesWithRelations: this.games.filter(g => g.vndbRelations && g.vndbRelations.length > 0).length
        };
    }
};

SearchIndex.init();
