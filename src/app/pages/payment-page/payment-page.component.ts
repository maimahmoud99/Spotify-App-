import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/products/cart.service';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  cartProducts: any[] = [];
  selectedMethod: 'cash' | 'visa' | null = null;
  cartSub!: Subscription;
  showCashConfirmation = false;
  isPlacingOrder = false;
  isRedirectingToStripe = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItems$.subscribe((updatedCart) => {
      this.cartProducts = updatedCart;
      this.cdr.detectChanges();
    });
  }

  get total(): number {
    const storedTotal = localStorage.getItem('totalPrice');
    return storedTotal ? Number(storedTotal) : 0;
  }

  get cartIsEmpty(): boolean {
    return this.cartProducts.length === 0;
  }

  selectMethod(method: 'cash' | 'visa'): void {
    this.selectedMethod = method;
  }

  triggerCashConfirmation(): void {
    if (this.cartIsEmpty) {
      this.router.navigate(['/']);
      return;
    }
    this.showCashConfirmation = true;
  }

  payCash(): void {
    const address = this.getShippingDetailsFromLocalStorage();
    if (!address) {
      this.toastr.error('Missing shipping details.', 'Error');
      this.router.navigate(['/decline-order']);
      return;
    }

    this.isPlacingOrder = true;

    this.paymentService.checkout('cash', address).subscribe({
      next: () => {
        this.toastr.success('Order placed successfully!', 'Success');
        this.clearCartData();
        this.showCashConfirmation = false;
        this.router.navigate(['/confirmPayment']);
      },
      error: () => {
        this.toastr.error(
          'Order could not be placed. Please try again.',
          'Error'
        );
        this.showCashConfirmation = false;
        this.router.navigate(['/decline-order']);
      },
      complete: () => (this.isPlacingOrder = false),
    });
  }

  redirectToStripe(): void {
    if (this.cartIsEmpty) {
      this.router.navigate(['/']);
      return;
    }

    const address = this.getShippingDetailsFromLocalStorage();
    if (!address) {
      this.toastr.error('Missing shipping details.', 'Error');
      return;
    }

    this.isRedirectingToStripe = true;

    this.paymentService.checkout('visa', address).subscribe({
      next: (res) => {
        this.isRedirectingToStripe = false;
        if (res.checkoutSessionUrl) {
          window.location.href = res.checkoutSessionUrl;
        } else {
          this.toastr.error('Failed to initiate checkout session.', 'Error');
        }
      },
      error: () => {
        this.isRedirectingToStripe = false;
        this.toastr.error(
          'Unable to start Stripe payment. Please try again.',
          'Error'
        );
        this.router.navigate(['/decline-order']);
      },
    });
  }

  getShippingDetailsFromLocalStorage(): {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  } | null {
    const shipping = localStorage.getItem('shippingAddress');
    return shipping ? JSON.parse(shipping) : null;
  }

  clearCartData(): void {
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('cart');
    localStorage.removeItem('shippingAddress');
    this.cartService.clearCart();
  }

  get totalItemsCount(): number {
    if (!this.cartProducts || this.cartProducts.length === 0) return 0;
    return this.cartProducts.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
