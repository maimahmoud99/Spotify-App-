import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-failed-payment',
  templateUrl: './failed-payment.component.html',
  styleUrls: ['./failed-payment.component.css'],
  imports: [FooterComponent, HeaderComponent],
})
export class FailedPaymentComponent {
  constructor(private router: Router) {}

  retryPayment() {
    this.router.navigate(['/payment']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
