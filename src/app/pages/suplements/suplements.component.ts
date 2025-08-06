import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MenCollectionComponent } from '../../components/image-collection/men-collection.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product.service';
import { HttpClient } from '@angular/common/http';
import { FilterComponent } from '../../components/filter/filter.component';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-suplements',
  imports: [MenCollectionComponent, HeaderComponent, ProductCardComponent, CommonModule, PaginationComponent, FooterComponent, FilterComponent, LoadingComponent],
  templateUrl: './suplements.component.html',
  styleUrl: './suplements.component.css'
})
export class SuplementsComponent implements OnInit {
  src = "assets/images/suplements_collection.svg";
  productes: any[] = [];
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
    { img: 'assets/icons/Swanson_Vitamins_Logo.jpg', brandName: 'Swanson' },
    { img: 'assets/icons/solgar-logo.png', brandName: 'Solgar'},
   
  ];

constructor(
  private http: HttpClient,
  private productService: ProductService,
  private route: ActivatedRoute,
  private router: Router
) {}

ngOnInit() {
  this.route.queryParams.subscribe((params) => {
    this.sort = params['sort'] || '';
    this.brand = params['brand'] || '';
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


  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    const params = {
      category: 'supplement',
      sort: this.sort,
      brand: this.brand
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
    );

    this.productService.getProduct(filteredParams, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.errorMessage = '';
          this.productes = response.products;
          this.totalItems = response.total;
          console.log(" API Response:", response);
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
      sort: this.sort || null,
      brand: this.brand || null,
      page: this.currentPage !== 1 ? this.currentPage : null
    },
    queryParamsHandling: 'merge',
  });
}


  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.productes.slice(start, end);
  }
}