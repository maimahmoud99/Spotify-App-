import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './admin-add-product.component.html',
})
export class AdminAddProductComponent {
  showError: boolean = false;
  showSuccess: boolean = false;
  showWarning: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  warningMessage: string = '';

  constructor(private adminService: AdminService) {}
  productCategories = [
    "shoes|67d080e25ebe64206430ae2b",
    "clothes|67d0805f5ebe64206430ae22",
    
    "equipment|67d080a35ebe64206430ae25",
    "supplements|67d080c45ebe64206430ae28",
    
  ];
  
  selectedCategory: string = "";
  shoesCategory:string="shoes";
  productSubcategories: string[] = [' ', 'shirts','pants',' '];
  productMaterials: string[] = [
    'Synthetics', 'cotton', 'Rubber', 'Vinyl Dumbbell', 'metal', 'Leather',
    'Plastic', 'cotton-lycra', 'Polyester', 'Polyester-cotton', 'Polyester-lycra',
    'Mesh', 'Textile', 'Synthetic Leather', 'Soft foam', 'Microfiber Leather'
  ];
  productColor: string[] = [
    'White',
    'Black',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Pink',
    'Brown',
    'Beige',
    'Silver',
    'Gold',
    'Navy',
    'Maroon',
    'Olive',
    'Teal',
    'Coral',
    'Multi-color',
    'Black/Orange'
  ];
  
  productSizes: (string | number)[] = [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 'S', 'm', 'L', 'XL', 'XXL'];


  selectedSubcategory: string = this.productSubcategories[0];
  selectedMaterial: string = this.productMaterials[0];
  selectedSize: string | number = this.productSizes[0];
  selectedColor: string = this.productColor[0];

  productDescription: string = '';
  imageUrl: string = '';
  productName: string = '';
  productBrand: string = '';
  productPrice: number | null = null;

  addProduct() {
    if (
      !this.productName || !this.productBrand || !this.productPrice ||
      !this.productColor || !this.imageUrl || !this.productDescription || !this.productMaterials
    ) {
      this.warningMessage = 'Please fill all the required fields';
      this.showWarning = true;
      setTimeout(() => this.showWarning = false, 5000); 
      return;
    }

    const product = {
      name: this.productName,
      price: this.productPrice,
      brand: this.productBrand,
      imageUrl: this.imageUrl,
      color: this.selectedColor,
      category: this.selectedCategory,
      gender: ["men"],
      size_range: ["6", "7", "8", "9", "10", "11", "12"],
      description: this.productDescription,
      material: this.selectedMaterial
    };

    this.adminService.addProduct(product).subscribe({
      next: (response) => {
        console.log('Product added successfully', response);
        this.successMessage = ' Product added Successfully';
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 5000); 
        this.resetForm();
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.errorMessage = 'Failure during adding product';
        this.showError = true;
        setTimeout(() => this.showError = false, 5000); 
      }
    });
  }

  resetForm() {
    this.productName = '';
    this.productBrand = '';
    this.productPrice = null;
    this.productDescription = '';
    this.selectedCategory = this.productCategories[0];
    this.selectedSubcategory = this.productSubcategories[0];
    this.selectedMaterial = this.productMaterials[0];
    this.selectedSize = this.productSizes[0];
    this.selectedColor = this.productColor[0];
  }
}
