import { DB } from './data.js';
import telemetry from './telemetry.js';

export class EdgeRecommender {
    constructor(storageKey = 'npher_user_profile') {
        this.storageKey = storageKey;
        this.lambda = 5e-8;
    }

    trackBehavior(tags, actionType = 'click') {
        let profile = this._loadProfile();

        if (!profile.vectors) {
            profile = { vectors: {}, lastUpdate: Date.now() };
        }

        const now = Date.now();
        const dt = now - (profile.lastUpdate || now);

        for (const tag in profile.vectors) {
            profile.vectors[tag] = profile.vectors[tag] * Math.exp(-this.lambda * dt);
        }

        const weightMap = { click: 1.0, favorite: 3.0, dwell_time_long: 2.0 };
        const addedWeight = weightMap[actionType] || 1.0;

        tags.forEach(tag => {
            profile.vectors[tag] = (profile.vectors[tag] || 0) + addedWeight;
        });

        profile.vectors = this._pruneDecayed(profile.vectors);

        profile.lastUpdate = now;
        this._saveProfile(profile);
    }

    getRecommendations(allGames, limit = 4) {
        const profile = this._loadProfile();

        if (!profile || !profile.vectors || Object.keys(profile.vectors).length === 0) {
            return this._shuffle(allGames).slice(0, limit);
        }

        const userVec = profile.vectors;

        const scored = allGames.map(game => {
            const gameVec = {};
            (game.tags || []).forEach(t => { gameVec[t] = 1.0; });

            let dotProduct = 0;
            let userNorm = 0;
            let gameNorm = 0;

            for (const tag in userVec) {
                dotProduct += userVec[tag] * (gameVec[tag] || 0);
                userNorm += userVec[tag] ** 2;
            }
            for (const tag in gameVec) {
                gameNorm += gameVec[tag] ** 2;
            }

            const similarity = gameNorm && userNorm
                ? dotProduct / (Math.sqrt(userNorm) * Math.sqrt(gameNorm))
                : 0;

            return { game, score: similarity };
        });

        const results = scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.game);

        if (telemetry) {
            telemetry.track({
                type: 'recommendation',
                name: 'rec_impression',
                data: {
                    count: results.length,
                    topTags: Object.entries(userVec)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([tag]) => tag)
                }
            });
        }

        return results;
    }

    scoreAllGames(allGames) {
        const profile = this._loadProfile();
        const scoreMap = new Map();

        if (!profile || !profile.vectors || Object.keys(profile.vectors).length === 0) {
            allGames.forEach(game => scoreMap.set(game.id, 0));
            return scoreMap;
        }

        const userVec = profile.vectors;

        allGames.forEach(game => {
            const gameVec = {};
            (game.tags || []).forEach(t => { gameVec[t] = 1.0; });

            let dotProduct = 0;
            let userNorm = 0;
            let gameNorm = 0;

            for (const tag in userVec) {
                dotProduct += userVec[tag] * (gameVec[tag] || 0);
                userNorm += userVec[tag] ** 2;
            }
            for (const tag in gameVec) {
                gameNorm += gameVec[tag] ** 2;
            }

            const similarity = gameNorm && userNorm
                ? dotProduct / (Math.sqrt(userNorm) * Math.sqrt(gameNorm))
                : 0;

            scoreMap.set(game.id, similarity);
        });

        return scoreMap;
    }

    static normalizeScore(score, maxScore) {
        return maxScore === 0 ? 0 : (score / maxScore) * 100;
    }

    trackClick(gameId, rank) {
        if (telemetry) {
            telemetry.track({
                type: 'recommendation',
                name: 'rec_click',
                data: { gameId, rank }
            });
        }
    }

    _loadProfile() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    _saveProfile(profile) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(profile));
        } catch {}
    }

    _pruneDecayed(vectors, threshold = 0.01) {
        const pruned = {};
        for (const tag in vectors) {
            if (vectors[tag] > threshold) {
                pruned[tag] = vectors[tag];
            }
        }
        return pruned;
    }

    _shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    getProfile() {
        const profile = this._loadProfile();
        if (!profile || !profile.vectors) return { tags: [], totalWeight: 0 };

        const entries = Object.entries(profile.vectors)
            .sort(([, a], [, b]) => b - a);

        return {
            tags: entries.map(([tag, weight]) => ({ tag, weight: Math.round(weight * 100) / 100 })),
            totalWeight: entries.reduce((sum, [, w]) => sum + w, 0),
            count: entries.length
        };
    }

    clearProfile() {
        localStorage.removeItem(this.storageKey);
    }
}

const edgeRecommender = new EdgeRecommender();

export { edgeRecommender };
export default edgeRecommender;
