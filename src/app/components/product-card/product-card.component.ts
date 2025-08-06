// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FavoritesService } from '../../services/favorites/favorites.service';
// import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';
// import { CartService } from '../../services/products/cart.service';
// import { ProductService } from '../../services/products/product.service';
// import { ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-product-card',
//   imports: [CommonModule, RouterModule],
//   standalone: true,
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.css'],
// })
// export class ProductCardComponent {
//   isHiddenPage: boolean = false;
//   @Input() data: any;
//   @Input() isFav: boolean = false;
//   @Output() removedFromFavorites = new EventEmitter<string>();

//   selectedColor: string = '';
//   selectedSize: string = '';
//   isAdded: boolean = false;

//   showLoginPrompt: boolean = false; // 🟢 ده الجديد
// isOutForUser: boolean = false;

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private favoritesService: FavoritesService,
//     private cartService: CartService,
//     private cdr: ChangeDetectorRef

//   ) {}

//   ngOnInit() {
//     this.selectedSize = this.data.size_range[0];
//     this.checkCurrentRoute();
//     this.checkIfFavorite();
//      this.checkUserSpecificOutOfStock();
//   }

//   checkCurrentRoute() {
//     const currentUrl = this.router.url;
//     this.isHiddenPage =
//       currentUrl.includes('equipment') ||
//       currentUrl.includes('supplements') ||
//       this.data.category?.name == 'supplement' ||
//       this.data.category?.name == 'equipment';
//   }

//   checkIfFavorite() {
//     this.favoritesService.getfavourite().subscribe({
//       next: (favourites) => {
//         this.isFav = favourites.some((fav) => fav.id == this.data.id);
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     });
//   }

// toggleFav() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     this.showLoginPrompt = true; // ✅ نفس الرسالة اللي بتظهر في addToCart
//     return;
//   }

//   if (!this.isFav) {
//     this.favoritesService.addFavorite(this.data).subscribe({
//       next: () => {
//         console.log(`${this.data.id} is added`);
//         this.isFav = true;
//       },
//       error: (err) => console.error('Error while adding to favorites:', err),
//     });
//   } else {
//     this.favoritesService.removeFavorite(this.data.id).subscribe({
//       next: () => {
//         console.log(`${this.data.id} is removed`);
//         this.isFav = false;
//         this.removedFromFavorites.emit(this.data.id);
//       },
//       error: (err) => {
//         console.log(err);
//       },
//     });
//   }
// }
// checkUserSpecificOutOfStock() {
//   const stored = localStorage.getItem('userOutOfStockItems');
//   const outOfStockItems = stored ? JSON.parse(stored) : [];
//   this.isOutForUser = this.data?.stock === 0 || outOfStockItems.includes(this.data._id);
// }

// addToCart() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     this.showLoginPrompt = true; // 👈 يظهر المودال
//     return;
//   }

//   this.cartService.addToCart(this.data._id, 1, this.selectedSize).subscribe(
//     (response) => {
//       console.log('Product added successfully:', response);
//       this.isAdded = true;
//       setTimeout(() => {
//         this.isAdded = false;
//       }, 1000);
//     },
//     (error) => {
//       console.error('Error adding product:', error);
//     }
//   );
// }

//   navigateToLogin() {
//     this.router.navigate(['/login']);
//   }
//   handleImageError(event: Event) {
//   const imgElement = event.target as HTMLImageElement;
//   imgElement.src = 'assets/images/image.png';
// }
// onImageClick(event?: MouseEvent) {
//   event?.stopPropagation();
//   event?.preventDefault();

//   const token = localStorage.getItem('token');
//   if (!token) {
//     this.showLoginPrompt = true;
//     return;
//   }

//   this.router.navigate(['/product', this.data._id]);
// }

// isOutOfStock(): boolean {
//   return this.data?.stock === 0;
// }

// getLowStockMessage(): string | null {
//   if (this.data?.stock > 0 && this.data?.stock <= 5) {
//     return `Hurry! Only ${this.data.stock} left in stock`;
//   }
//   return null;
// }

// }

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { CartService } from '../../services/products/cart.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnChanges {
  @Input() data: any;
  @Input() isFav: boolean = false;
  @Output() removedFromFavorites = new EventEmitter<string>();

  selectedColor: string = '';
  selectedSize: string = '';
  isAdded: boolean = false;
  showLoginPrompt: boolean = false;
  isOutForUser: boolean = false;
  isHiddenPage: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.selectedSize = this.data?.size_range?.[0] || '';
      this.checkCurrentRoute();
      this.checkIfFavorite();
      this.checkUserSpecificOutOfStock();
    }
  }

  checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.isHiddenPage =
      currentUrl.includes('equipment') ||
      currentUrl.includes('supplements') ||
      this.data?.category?.name === 'supplement' ||
      this.data?.category?.name === 'equipment';
  }

  checkIfFavorite() {
    this.favoritesService.getfavourite().subscribe({
      next: (favs) => {
        this.isFav = favs.some((f) => f.id === this.data.id);
      },
      error: (err) => console.error(err),
    });
  }

  toggleFav() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt = true;
      return;
    }

    if (!this.isFav) {
      this.favoritesService.addFavorite(this.data).subscribe({
        next: () => (this.isFav = true),
        error: (err) => console.error(err),
      });
    } else {
      this.favoritesService.removeFavorite(this.data.id).subscribe({
        next: () => {
          this.isFav = false;
          this.removedFromFavorites.emit(this.data.id);
        },
        error: (err) => console.error(err),
      });
    }
  }

  addToCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt = true;
      return;
    }

    this.cartService.addToCart(this.data._id, 1, this.selectedSize).subscribe(
      (response) => {
        console.log('✅ Product added:', response);
        this.isAdded = true;

        // لو كانت آخر حبة
        if (this.data.stock === 1) {
          const stored = localStorage.getItem('userOutOfStockItems');
          const outOfStockItems = stored ? JSON.parse(stored) : [];

          if (!outOfStockItems.includes(this.data._id)) {
            outOfStockItems.push(this.data._id);
            localStorage.setItem(
              'userOutOfStockItems',
              JSON.stringify(outOfStockItems)
            );
          }
          this.isOutForUser = false;
          setTimeout(() => {
            this.checkUserSpecificOutOfStock();
            this.cdr.detectChanges();
          }, 0);
        } else {
          this.checkUserSpecificOutOfStock();
        }

        setTimeout(() => {
          this.isAdded = false;
        }, 1000);
      },
      (error) => {
        console.error('❌ Error adding product:', error);
      }
    );
  }

  // checkUserSpecificOutOfStock() {
  //   const stored = localStorage.getItem('userOutOfStockItems');
  //   const outOfStockItems = stored ? JSON.parse(stored) : [];

  //   const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //   const cartItem = cart.find(
  //     (item: any) =>
  //       item.product?._id === this.data._id &&
  //       (!item.size || item.size === this.selectedSize)
  //   );

  //   const cartQuantity = cartItem?.quantity || 0;
  //   const availableStock = this.data?.stock || 0;

  //   this.isOutForUser =
  //     this.data?.stock === 0 ||
  //     outOfStockItems.includes(this.data._id) ||
  //     cartQuantity >= availableStock;
  // }
  checkUserSpecificOutOfStock() {
    const stored = localStorage.getItem('userOutOfStockItems');
    const outOfStockItems = stored ? JSON.parse(stored) : [];

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const category = this.data?.category?.name;
    const isSizeBased = ['men', 'women', 'shoes'].includes(category);

    let isOut = false;

    if (isSizeBased) {
      const stockBySize = this.data?.stock_by_size || {};
      const sizeKeys = Object.keys(stockBySize);

      const allSizesOut = sizeKeys.every((size) => {
        const available = stockBySize[size] || 0;

        const cartItem = cart.find(
          (item: any) =>
            item.product?._id === this.data._id && item.size === size
        );
        const cartQty = cartItem?.quantity || 0;

        return available === 0 || cartQty >= available;
      });

      isOut = allSizesOut;
    } else {
      const availableStock = this.data?.stock || 0;
      const cartItem = cart.find(
        (item: any) => item.product?._id === this.data._id
      );
      const cartQuantity = cartItem?.quantity || 0;

      isOut = availableStock === 0 || cartQuantity >= availableStock;
    }

    this.isOutForUser = isOut || outOfStockItems.includes(this.data._id);
  }

  isOutOfStock(): boolean {
    return this.isOutForUser;
  }

  // getLowStockMessage(): string | null {
  //   if (this.data?.stock > 0 && this.data?.stock <= 5 && !this.isOutForUser) {
  //     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //     const cartItem = cart.find(
  //       (item: any) =>
  //         item.product?._id === this.data._id &&
  //         (!item.size || item.size === this.selectedSize)
  //     );

  //     const cartQuantity = cartItem?.quantity || 0;

  //     if (cartQuantity < this.data.stock) {
  //       const remaining = this.data.stock - cartQuantity;
  //       return `Hurry! Only ${remaining} left in stock`;
  //     }
  //   }
  //   return null;
  // }
  getLowStockMessage(): string | null {
    const category = this.data?.category?.name;
    const isSizeBased = ['men', 'women', 'shoes'].includes(category);

    let availableStock = 0;
    let cartQuantity = 0;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (isSizeBased && this.selectedSize) {
      const stockBySize = this.data?.stock_by_size || {};
      availableStock = stockBySize[this.selectedSize] || 0;

      const cartItem = cart.find(
        (item: any) =>
          item.product?._id === this.data._id && item.size === this.selectedSize
      );
      cartQuantity = cartItem?.quantity || 0;

      const tempQuantity = +(
        localStorage.getItem(`quantity_${this.data._id}`) ?? '0'
      );
      cartQuantity += tempQuantity;
    } else {
      availableStock = this.data?.stock || 0;

      const cartItem = cart.find(
        (item: any) => item.product?._id === this.data._id
      );
      cartQuantity = cartItem?.quantity || 0;

      const tempQuantity = +(
        localStorage.getItem(`quantity_${this.data._id}`) ?? '0'
      );
      cartQuantity += tempQuantity;
    }

    const remaining = availableStock - cartQuantity;

    if (remaining > 0 && remaining <= 5 && !this.isOutForUser) {
      return `Hurry! Only ${remaining} left in stock`;
    }

    return null;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/image.png';
  }

  onImageClick(event?: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginPrompt = true;
      return;
    }

    this.router.navigate(['/product', this.data._id]);
  }
}
