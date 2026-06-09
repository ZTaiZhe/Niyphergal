import { chineseToPinyin, getFirstLetters } from './utils.js';

const FUZZY_MAP = {
    'zh': ['z'], 'z': ['zh'],
    'ch': ['c'], 'c': ['ch'],
    'sh': ['s'], 's': ['sh'],
    'an': ['ang'], 'ang': ['an'],
    'en': ['eng'], 'eng': ['en'],
    'in': ['ing'], 'ing': ['in'],
    'l': ['n', 'r'], 'n': ['l'],
    'f': ['h'], 'h': ['f'],
    'r': ['l']
};

const FUZZY_INITIAL_MAP = {
    'zh': ['z'], 'z': ['zh'],
    'ch': ['c'], 'c': ['ch'],
    'sh': ['s'], 's': ['sh'],
    'l': ['n', 'r'], 'n': ['l'],
    'f': ['h'], 'h': ['f'],
    'r': ['l']
};

const FUZZY_FINAL_MAP = {
    'an': ['ang'], 'ang': ['an'],
    'en': ['eng'], 'eng': ['en'],
    'in': ['ing'], 'ing': ['in']
};

const INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];

function splitPinyinSyllables(pinyinStr) {
    const syllables = [];
    let remaining = pinyinStr.toLowerCase().replace(/\s+/g, '');

    while (remaining.length > 0) {
        let matched = false;

        for (const initial of INITIALS) {
            if (remaining.startsWith(initial)) {
                const afterInitial = remaining.slice(initial.length);
                const finalMatch = matchFinal(afterInitial);
                if (finalMatch) {
                    syllables.push(initial + finalMatch);
                    remaining = remaining.slice(initial.length + finalMatch.length);
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            const finalMatch = matchFinal(remaining);
            if (finalMatch) {
                syllables.push(finalMatch);
                remaining = remaining.slice(finalMatch.length);
                matched = true;
            }
        }

        if (!matched) {
            syllables.push(remaining[0]);
            remaining = remaining.slice(1);
        }
    }

    return syllables;
}

function matchFinal(str) {
    const finals = ['ang', 'eng', 'ing', 'ong', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'in', 'un', 'a', 'o', 'e', 'i', 'u', 'v', 'er'];
    for (const f of finals) {
        if (str.startsWith(f)) {return f;}
    }
    return null;
}

function getFuzzySyllableVariants(syllable) {
    const variants = new Set([syllable]);

    let initial = '';
    let final_ = '';
    for (const ini of INITIALS) {
        if (syllable.startsWith(ini)) {
            initial = ini;
            final_ = syllable.slice(ini.length);
            break;
        }
    }
    if (!initial) {
        final_ = syllable;
    }

    const fuzzyInitials = (initial && FUZZY_INITIAL_MAP[initial]) || [];
    const fuzzyFinals = (final_ && FUZZY_FINAL_MAP[final_]) || [];

    for (const fi of fuzzyInitials) {
        variants.add(fi + final_);
    }

    for (const ff of fuzzyFinals) {
        variants.add(initial + ff);
    }

    for (const fi of fuzzyInitials) {
        for (const ff of fuzzyFinals) {
            variants.add(fi + ff);
        }
    }

    return Array.from(variants);
}

export function expandFuzzyPinyin(pinyinStr) {
    if (!pinyinStr) {return [];}

    const normalized = pinyinStr.replace(/\s+/g, '').toLowerCase();

    if (!/^[a-z]+$/.test(normalized)) {return [];}

    const syllables = splitPinyinSyllables(normalized);
    if (syllables.length === 0) {return [normalized];}

    const variantSets = syllables.map(s => getFuzzySyllableVariants(s));

    const MAX_VARIANTS = 16;
    let results = [''];
    for (const variantSet of variantSets) {
        const newResults = [];
        for (const existing of results) {
            for (const variant of variantSet) {
                newResults.push(existing + variant);
            }
        }
        results = newResults.slice(0, MAX_VARIANTS);
    }

    return results.filter(v => v !== normalized);
}

export function expandFuzzyFirstLetters(firstLetterStr) {
    if (!firstLetterStr) {return [];}

    const normalized = firstLetterStr.replace(/\s+/g, '').toLowerCase();

    if (!/^[a-z]+$/.test(normalized)) {return [];}

    const variants = new Set();
    const letters = normalized.split('');

    const letterFuzzyMap = {
        'z': ['z'], 'c': ['c'], 's': ['s'],
        'l': ['l', 'n'], 'n': ['n', 'l'],
        'f': ['f', 'h'], 'h': ['h', 'f'],
        'r': ['r', 'l']
    };

    function generateVariants(index, current) {
        if (index >= letters.length) {
            if (current !== normalized) {
                variants.add(current);
            }
            return;
        }

        const letter = letters[index];
        const fuzzyLetters = letterFuzzyMap[letter] || [letter];
        for (const fl of fuzzyLetters) {
            generateVariants(index + 1, current + fl);
        }
    }

    generateVariants(0, '');
    return Array.from(variants);
}

export function searchWithFuzzyPinyin(query, searchFn) {
    const exactResults = searchFn(query);
    if (exactResults.length >= 5) {return exactResults;}

    const queryPinyin = chineseToPinyin(query);
    const queryFirst = getFirstLetters(query);

    const fuzzyPinyinVariants = expandFuzzyPinyin(queryPinyin);
    const fuzzyFirstVariants = expandFuzzyFirstLetters(queryFirst);

    const fuzzyResults = new Map();

    for (const variant of fuzzyPinyinVariants) {
        const results = searchFn(variant);
        for (const r of results) {
            if (!fuzzyResults.has(r.id)) {
                fuzzyResults.set(r.id, { ...r, score: Math.min(r.score, 70) });
            }
        }
    }

    for (const variant of fuzzyFirstVariants) {
        const results = searchFn(variant);
        for (const r of results) {
            if (!fuzzyResults.has(r.id)) {
                fuzzyResults.set(r.id, { ...r, score: Math.min(r.score, 55) });
            }
        }
    }

    const seenIds = new Set(exactResults.map(r => r.id));
    const additionalResults = Array.from(fuzzyResults.values())
        .filter(r => !seenIds.has(r.id))
        .sort((a, b) => b.score - a.score);

    return [...exactResults, ...additionalResults];
}

export const FUZZY_SCORE = {
    EXACT: 100,
    PREFIX: 80,
    CONTAINS: 60,
    FUZZY_EXACT: 70,
    FUZZY_PREFIX: 55,
    FUZZY_CONTAINS: 40,
    FUZZY_FUZZY: 30
};

export default {
    expandFuzzyPinyin,
    expandFuzzyFirstLetters,
    searchWithFuzzyPinyin,
    FUZZY_SCORE,
    FUZZY_MAP
};
