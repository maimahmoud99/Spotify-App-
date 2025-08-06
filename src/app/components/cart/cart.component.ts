import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/products/cart.service';
import { ProductService } from '../../services/products/product.service';
import { ToastrService } from 'ngx-toastr';

export interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  category: {
    name: string;
  };
  size_range: string[];
  stock: number;
  stock_by_size: Record<string, number>;
}

export interface CartProduct {
  product: Product;
  size: string;
  quantity: number;
}

export interface CartUpdate {
  productId: string;
  currentSize: string;
  newSize?: string;
  quantity?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  @Input() product!: CartProduct;
  @Output() quantityChanged = new EventEmitter<void>();
  @Output() productDeleted = new EventEmitter<string>();
  @Output() productUpdated = new EventEmitter<CartUpdate>();

  originalSize: string = '';
  originalQuantity: number = 1;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.originalSize = this.product.size;
    this.originalQuantity = this.product.quantity;
  }
  get availableStock(): number {
    const product = this.product.product;
    const size = this.product.size;

    if (product.stock_by_size && size && product.stock_by_size[size] != null) {
      return product.stock_by_size[size];
    }

    return product.stock ?? 0;
  }

  increaseQuantity() {
    if (this.product.quantity >= this.availableStock) {
      this.toastr.warning(
        `Only ${this.availableStock} item(s) available in stock.`,
        'Cannot increase quantity'
      );
      return;
    }

    this.product.quantity++;
    this.updateQuantity();
  }
  onInputChange(value: number) {
    if (value < 1) {
      this.product.quantity = 1;
    } else if (value > this.availableStock) {
      this.product.quantity = this.availableStock;
      this.toastr.warning(
        `Only ${this.availableStock} item(s) available in stock.`,
        'Cannot exceed stock'
      );
    } else {
      this.product.quantity = value;
    }

    this.updateQuantity();
  }

  decreaseQuantity() {
    if (this.product.quantity > 1) {
      this.product.quantity--;
      this.updateQuantity();
    }
  }

  onQuantityInputBlur() {
    if (this.product.quantity < 1) {
      this.product.quantity = 1;
    }
  }

  updateQuantity() {
    this.cartService
      .updateQuantity(
        this.product.product._id,
        this.product.quantity,
        this.product.size
      )
      .subscribe({
        next: () => {
          this.originalQuantity = this.product.quantity;
          this.emitProductUpdate({ quantity: this.product.quantity });
        },
        error: (err) => console.error('Failed to update quantity:', err),
      });
  }

  // selectSize(newSize: string) {
  //   if (newSize !== this.originalSize) {
  //     const update = {
  //       productId: this.product.product._id,
  //       currentSize: this.originalSize,
  //       newSize,
  //       quantity: this.product.quantity,
  //     };

  //     this.cartService.updateCart([update]).subscribe({
  //       next: () => {
  //         this.product.size = newSize;
  //         this.originalSize = newSize;
  //       },
  //       error: (err) => console.error('Size update failed', err),
  //     });
  //   }
  // }
selectSize(newSize: string) {
  if (newSize !== this.originalSize) {
    const product = this.product.product;
    const newAvailableStock =
      product.stock_by_size?.[newSize] ?? product.stock ?? 0;

    // لو الكمية أكبر من المتاح في المقاس الجديد
    if (this.product.quantity > newAvailableStock) {
      this.toastr.warning(
        `Only ${newAvailableStock} item(s) available in size "${newSize}". Cannot switch.`,
        'Size not available'
      );
      
      // رجّع المقاس القديم بعد شوية
      setTimeout(() => {
        this.product.size = this.originalSize;
      });
      return;
    }

    // ✅ الحل السهل: ندور في كل الكارت (من localStorage)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const duplicateItem = cart.find(
      (item: any) =>
        item.product._id === product._id &&
        item.size === newSize &&
        item !== this.product
    );

    if (duplicateItem) {
      this.toastr.warning(
        `This size already exists in your cart. Please adjust the quantity from there.`,
        'Duplicate item'
      );

      // رجّع المقاس القديم
      setTimeout(() => {
        this.product.size = this.originalSize;
      });
      return;
    }

    // لو مفيش duplicate ومفيش مشكلة في الكمية، نكمّل التحديث
    const update = {
      productId: product._id,
      currentSize: this.originalSize,
      newSize,
      quantity: this.product.quantity,
    };

    this.cartService.updateCart([update]).subscribe({
      next: () => {
        this.product.size = newSize;
        this.originalSize = newSize;
        this.toastr.success('Size updated successfully');
        this.emitProductUpdate({ quantity: this.product.quantity });
      },
      error: (err) => {
        console.error('Size update failed', err);
        this.toastr.error('Failed to update size. Please try again.', 'Error');
      },
    });
  }
}



  deleteProduct() {
    this.cartService
      .removeFromCart(this.product.product._id, this.product.size)
      .subscribe({
        next: () => this.productDeleted.emit(this.product.product._id),
        error: (err) =>
          console.error('Failed to delete product from cart:', err),
      });
  }

  private emitProductUpdate(changes: Partial<CartUpdate>) {
    this.productUpdated.emit({
      productId: this.product.product._id,
      currentSize: this.originalSize,
      ...changes,
    });
  }
}