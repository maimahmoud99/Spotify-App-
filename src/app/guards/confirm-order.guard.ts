import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConfirmOrderGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const address = localStorage.getItem('shippingAddress');
    const totalPrice = localStorage.getItem('totalPrice');
    const cart = localStorage.getItem('cart');

    if (address && totalPrice && cart?.length) {
      console.log(cart);
      return true;
    }

    this.router.navigate(['/payment']);
    return false;
  }
}
