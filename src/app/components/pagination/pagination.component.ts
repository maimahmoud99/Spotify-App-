import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsPerPage: any;
  @Output() onClick: EventEmitter<number> = new EventEmitter();

  totalPages = 0;
  pages: (number | string)[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.totalItems && this.itemsPerPage) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = this.getDisplayedPages();
    }
  }

  getDisplayedPages(): (number | string)[] {
    const totalVisible = 5; // عدد الصفحات المعروضة في المنتصف
    const pages: (number | string)[] = [];

    if (this.totalPages <= totalVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    pages.push(1); // أول صفحة دائمًا

    if (this.currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (this.currentPage < this.totalPages - 2) {
      pages.push('...');
    }

    pages.push(this.totalPages); // آخر صفحة دائمًا

    return pages;
  }

  pageClicked(page: any) {
    if (page === '...') return;
    if (page <= this.totalPages && page > 0) {
      this.onClick.emit(page);
    }
  }
}
