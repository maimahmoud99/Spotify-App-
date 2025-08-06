import { Component, NgZone, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/products/cart.service';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-confirm-payment',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    LoadingComponent,
  ],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css',
})
export class ConfirmPaymentComponent implements OnInit {
  loading = true;
  constructor(
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const address = this.getShippingDetailsFromLocalStorage();
    if (!sessionId) {
      this.loading = false;
      this.router.navigate(['/payment']);
      // this.router.navigate(['/confirmPayment']);
      return;
    }
    if (sessionId && address) {
      this.paymentService.placeStripeOrder(sessionId, address).subscribe({
        next: (res) => {
          this.clearCartData();
          this.loading = false;
          this.toastr.success('Order placed successfully!', 'Success');
          // this.router.navigate(['/confirmPayment']);
          this.ngZone.run(() => {
            setTimeout(() => {
              this.router.navigate(['/confirmPayment']);
            }, 1000);
          });
        },
        error: () => {
          this.toastr.error(
            'Stripe payment was made but order failed.',
            'Error'
          );
          this.loading = false;
          this.router.navigate(['/decline-order']);
        },
      });
    } else {
      // this.toastr.error('Missing payment session or address.');
      // this.router.navigate(['/decline-order']);
    }
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
  successPayment() {
    this.router.navigate(['/home']);
  }
  TrackMyOrder() {
    this.router.navigate(['/profile']);
  }
  clearCartData(): void {
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('cart');
    localStorage.removeItem('shippingAddress');
    this.cartService.clearCart();
  }
}
