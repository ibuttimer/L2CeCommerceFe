/**
 * Class representing a Spring Data reponse pagination entry
 * Note: 'number' is 0-based corresponding to backend
 */
export class Pagination {

    static readonly FIRST_PAGE = 0;         // backend start page
    static readonly DISPLAY_1ST_PAGE = 1;   // frnotend start page

    size!: number;
    totalElements!: number;
    totalPages!: number;
    number!: number;

    constructor() {
        this.reset();
    }

    /**
     * Get backend page number
     * @returns 
     */
     get page(): number {
        return this.number;
    }

    /**
     * Set backend page number
     * @returns 
     */
     set page(newPage: number) {
        this.number = newPage;
    }

    /**
     * Get frontend page number for display
     * @returns 
     */
    get displayPage(): number {
        return this.number + 1; 
    }

    /**
     * Set frontend page number for display
     * @returns 
     */
    set displayPage(newPage: number) {
        this.page = newPage - 1; 
    }

    /**
     * Get frontend start index for display
     * @returns 
     */
    get displayStart(): number {
        return (this.number * this.size) + 1; 
    }

    /**
     * Get frontend end index for display
     * @returns 
     */
    get displayEnd(): number {
        let end = (this.displayPage * this.size);
        return end < this.totalElements ? end : this.totalElements; 
    }

    /**
     * Reset the pagination
     */
     reset(): void {
        this.size = 10;
        this.totalElements = 0;
        this.totalPages = 0;
        this.number = Pagination.FIRST_PAGE;
    }

    /**
     * Reset the pagination
     */
     setFrom(from: Pagination): void {
        this.size = from.size;
        this.totalElements = from.totalElements;
        this.totalPages = from.totalPages;
        this.number = from.number;
    }
}
