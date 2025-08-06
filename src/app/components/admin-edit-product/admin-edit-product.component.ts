import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductService } from '../../services/products/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent,FooterComponent],
  templateUrl: './admin-edit-product.component.html',
 
})
export class AdminEditProductComponent implements OnInit {

  

  product: any = {};
  productCategories: string[] = ["67d080e25ebe64206430ae2b", "67d0805f5ebe64206430ae22"];
  productSubcategories: string[] = [' ', 'shirts', 'pants'];
  productMaterials: string[] = [
    'Synthetics', 'cotton', 'Rubber', 'Vinyl Dumbbell', 'metal', 'Leather',
    'Plastic', 'cotton-lycra', 'Polyester', 'Polyester-cotton', 'Polyester-lycra',
    'Mesh', 'Textile', 'Synthetic Leather', 'Soft foam', 'Microfiber Leather'
  ];
  productSizes: string[] = ['S', 'M', 'L', 'XL'];
  productColor: string[] = ['Red', 'Blue', 'Black', 'White'];

  selectedCategory: string = this.productCategories[0];

  constructor(private adminService: AdminService,
   private route: ActivatedRoute,private productService:ProductService, ) {}
    productId: string = ''; 
    products:any;
 
  ngOnInit(): void {
    console.log(this.productId)
    this.productId = this.route.snapshot.paramMap.get('id') || ''; 
    console.log('Product ID in AdminEditProductComponent:', this.productId);
    this.productService.getProductById(this.productId).subscribe({
      next:(data)=>{
        
        this.products = data ,
        console.log(this.products)},
      error:(err)=>{console.log(err)},
      complete:()=>{console.log("completed")}
     });
  }

  onInputChange(field: string, value: any): void {
    this.updatedProductData[field] = value;
  }

  updateProduct(): void {
    if (this.productId && Object.keys(this.updatedProductData).length > 0) {
      this.adminService.editProduct(this.productId, this.updatedProductData).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.showSuccess = true;
          this.successMessage = 'Product updated successfully';
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.showError = true;
          this.errorMessage = 'Failed to update product';
        }
      });
    } else {
      this.showWarning = true;
      this.warningMessage = 'No changes were made';
    }
  }
  
  


  showError: boolean = false;
  showSuccess: boolean = false;
  showWarning: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  warningMessage: string = '';

  updatedProductData: any = {};
  
}