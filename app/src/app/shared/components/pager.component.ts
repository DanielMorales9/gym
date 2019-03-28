import {Component, OnInit, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'pager',
    templateUrl: './pager.component.html',
    styleUrls: ['../../root.css']
})
export class PagerComponent implements OnInit {

    @Output()
    private pager = new EventEmitter();

    page: number = 0;
    size: number = 3;
    pages: Array<number>;
    totalPages: number;

    constructor() { }

    ngOnInit(): void {
        this.totalPages = 0;
        this.pages = [];
    }

    public setSize(size) {
        this.size = size;
    }

    public getSize() {
        return this.size
    }

    public setPageNumber(page) {
        this.page = page
    }

    public getPage() {
        return this.page;
    }

    public setTotalPages(totalPages) {
        this.totalPages = totalPages
    }

    public getTotalPages() {
        return this.totalPages;
    }

    public updatePages() {
        this.pages = new Array<number>(this.totalPages);
    }

    previousPage() {
        this.page -= 1;
        this.emitUpdateToParentComponent()
    }

    nextPage() {
        this.page += 1;
        this.emitUpdateToParentComponent()
    }

    setPage(i) {
        this.page = i;
        this.emitUpdateToParentComponent()
    }

    private emitUpdateToParentComponent() {
        this.pager.emit("updated")
    }
}