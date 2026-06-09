import { searchController } from './searchController.js';
import { SearchHistoryManager } from './searchHistoryManager.js';
import { HotSearchManager } from './hotSearchManager.js';
import { SuggestionGenerator } from './suggestionGenerator.js';
import { PaginationManager } from '../foundation/paginationManager.js';
import { SearchUIRenderer } from './searchUIRenderer.js';

export const SearchSuggestion = searchController;

export {
    SearchHistoryManager,
    HotSearchManager,
    SuggestionGenerator,
    PaginationManager,
    SearchUIRenderer
};
