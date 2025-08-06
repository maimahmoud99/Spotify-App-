import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenCollectionComponent } from '../../components/image-collection/men-collection.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { FilterComponent } from '../../components/filter/filter.component';
import { ProductService } from '../../services/products/product.service';
import { HttpClient } from '@angular/common/http';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-men',
  standalone: true,
  imports: [
    MenCollectionComponent,
    HeaderComponent,
    ProductCardComponent,
    CommonModule,
    PaginationComponent,
    FooterComponent,
    FilterComponent,
    LoadingComponent
  ],
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.css']
})
export class MenComponent implements OnInit {
  src = "assets/images/men_collection.svg";
  menClothes: any = [];
  subCategory: string = '';
  sort: string = '';
  brand: string = '';
  selectedIndex: number | null = null;
  priceindex: number | null = null;
  totalItems = 0;
  itemsPerPage = 8;
  currentPage = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  infoBrand: any = [
    { img: 'assets/icons/adidas.svg', brandName: 'Adidas' },
    { img: 'assets/icons/nike.svg', brandName: 'Nike' },
    { img: 'assets/icons/nilton.svg', brandName: 'Nileton' },
    { img: 'assets/icons/misery.svg', brandName: 'Mesery' }
  ];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.subCategory = params['subCategory'] || '';
      this.brand = params['brand'] || '';
      this.sort = params['sort'] || '';
      this.currentPage = +params['page'] || 1;

      this.loadProducts();
    });
  }

  updateFilters(filterData: { sort: string; brand: string }) {
    this.sort = filterData.sort;
    this.brand = filterData.brand;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadProducts();
  }

  display(text: string) {
    this.subCategory = this.subCategory === text ? '' : text;
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadProducts();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateQueryParams();
      this.loadProducts();
    }
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        subCategory: this.subCategory || null,
        brand: this.brand || null,
        sort: this.sort || null,
        page: this.currentPage !== 1 ? this.currentPage : null
      },
      queryParamsHandling: 'merge',
    });
  }

  loadProducts() {
    this.isLoading = true;

    const params = {
      gender: 'men',
      category: 'clothes',
      subCategory: this.subCategory,
      sort: this.sort,
      brand: this.brand
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );

    this.productService.getProduct(filteredParams, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.errorMessage = '';
          this.menClothes = response.products;
          this.totalItems = response.total;
          console.log("✅ API Response:", response);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 500) {
            this.errorMessage = 'no data found';
          } else {
            this.errorMessage = 'An error occurred while loading products.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.menClothes.slice(start, end);
  }
}
