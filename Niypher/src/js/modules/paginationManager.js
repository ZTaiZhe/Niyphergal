export class PaginationManager {
    constructor(pageSize) {
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.totalPages = 1;
    }

    calculateTotalPages(totalItems) {
        this.totalPages = Math.ceil(totalItems / this.pageSize);
        return this.totalPages;
    }

    getCurrentPageItems(allItems) {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return allItems.slice(startIndex, endIndex);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    reset() {
        this.currentPage = 1;
        this.totalPages = 1;
    }

    canGoNext() {
        return this.currentPage < this.totalPages;
    }

    canGoPrevious() {
        return this.currentPage > 1;
    }
}
