import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/products/cart.service';
import { LoadingComponent } from '../components/loading/loading.component';

@Component({
  selector: 'app-confirm-order',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    LoadingComponent,
  ],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css',
})
export class ConfirmOrderComponent implements OnInit {
  address!: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  } | null;

  showFinalConfirmation = false;
  isSessionValid = false;
  sessionId = '';
  isLoading = true;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';
    const storedAddress = localStorage.getItem('shippingAddress');

    if (this.sessionId) {
      localStorage.setItem('session_id', this.sessionId);
    }

    if (!storedAddress || !this.sessionId) {
      this.toastr.error('Missing payment method or address.', 'Error');
      this.isLoading = false;
      this.router.navigate(['/payment']);
      return;
    }

    this.address = JSON.parse(storedAddress);

    this.paymentService.getStripeSessionStatus(this.sessionId).subscribe({
      next: (res) => {
        if (res.status === 'paid') {
          this.isSessionValid = true;
          localStorage.setItem('stripePaid', 'true');
        } else {
          this.toastr.warning('Payment not completed.', 'Warning');
          this.router.navigate(['/decline-order']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.warning('Unable to verify payment session.', 'Warning');
        this.router.navigate(['/decline-order']);
        this.isLoading = false;
      },
    });
  }

  confirmPayment(): void {
    this.showFinalConfirmation = true;
  }

  placeOrder(): void {
    if (!this.address || !this.isSessionValid) {
      this.toastr.error('Cannot confirm unpaid order.', 'Error');
      return;
    }

    // this.paymentService
    //   .confirmOrder({
    //     paymentMethod: 'visa',
    //     shippingAddress: this.address,
    //   })
    //   .subscribe({
    //     next: () => {
    //       this.toastr.success('Order placed successfully!', 'Success');

    //       localStorage.removeItem('totalPrice');
    //       localStorage.removeItem('cart');
    //       localStorage.removeItem('stripePaid');
    //       localStorage.removeItem('shippingAddress');

    //       this.cartService.clearCart();

    //       this.router.navigate(['/confirmPayment']);
    //     },
    //     error: () => {
    //       this.toastr.error(
    //         'Order confirmation failed. Please try again.',
    //         'Error'
    //       );
    //       this.router.navigate(['/decline-order']);
    //     },
    //   });
  }
}

// export class ConfirmOrderComponent implements OnInit {
//   address!: {
//     address: string;
//     city: string;
//     country: string;
//     postalCode: string;
//     phone: string;
//   } | null;

//   showFinalConfirmation = false;
//   isSessionValid = false;
//   sessionId = '';
//   isLoading = true;

//   constructor(
//     private paymentService: PaymentService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private toastr: ToastrService,
//     private cartService: CartService
//   ) {}

//   ngOnInit(): void {
//     this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';
//     const storedAddress = localStorage.getItem('shippingAddress');

//     if (this.sessionId) {
//       localStorage.setItem('session_id', this.sessionId);
//     }

//     if (!storedAddress || !this.sessionId) {
//       this.toastr.error('Missing payment method or address.', 'Error');
//       this.isLoading = false;
//       this.router.navigate(['/payment']);
//       return;
//     }

//     this.address = JSON.parse(storedAddress);

//     this.paymentService.getStripeSessionStatus(this.sessionId).subscribe({
//       next: (res) => {
//         if (res.status === 'paid') {
//           this.isSessionValid = true;
//           localStorage.setItem('stripePaid', 'true');
//         } else {
//           this.toastr.error('Payment incomplete.', 'Error');
//           this.router.navigate(['/decline-order']);
//         }
//         this.isLoading = false;
//       },
//       error: () => {
//         this.toastr.error('Payment information invalid.', 'Error');
//         this.router.navigate(['/decline-order']);
//         this.isLoading = false;
//       },
//     });
//   }

//   confirmPayment(): void {
//     this.showFinalConfirmation = true;
//   }

//   placeOrder(): void {
//     if (!this.address || !this.isSessionValid) {
//       this.toastr.error('Cannot confirm unpaid order.', 'Error');
//       return;
//     }

//     this.paymentService
//       .confirmOrder({
//         paymentMethod: 'visa',
//         shippingAddress: this.address,
//       })
//       .subscribe({
//         next: () => {
//           this.toastr.success('Order placed successfully!', 'Success');

//           localStorage.removeItem('totalPrice');
//           localStorage.removeItem('cart');
//           localStorage.removeItem('stripePaid');
//           localStorage.removeItem('shippingAddress');

//           this.cartService.clearCart();

//           this.router.navigate(['/confirmPayment']);
//         },
//         error: () => {
//           this.toastr.error('Order confirmation failed.', 'Error');
//           this.router.navigate(['order-decline']);
//         },
//       });
//   }
// }
