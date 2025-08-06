import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/products/cart.service';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { LogoutModalComponent } from "../logout-modal/logout-modal.component";
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, LogoutModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  fname: string | null = '';
  email: string | null = '';
  show: string = 'hidden';
  ishidden: boolean = false;
  token: string | null = null;
  data: any;
  showLoginPrompt: boolean = false;
  @ViewChild(LogoutModalComponent) logoutModalRef!: LogoutModalComponent;

  cartItemCount: number = 0;
  favoriteItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {
    this.token = localStorage.getItem('token');
  }



  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fname = localStorage.getItem('Fname');
    this.email = localStorage.getItem('Email');

    this.cartService.refreshCartCount();
    this.favoritesService.initializeFavorites();

    this.cartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
    });

    this.favoritesService.favoriteCount$.subscribe((count) => {
      this.favoriteItemCount = count;
    });
  }

  toggel() {
    this.show = this.show === 'hidden' ? 'block' : 'hidden';
  }


  openLogoutModal() {
    this.logoutModalRef.open();
  }

  handleLogout() {
    this.authService.signout();
    this.router.navigate(['/home'], { replaceUrl: true });
    localStorage.removeItem('cart');
    this.token = null;
    localStorage.removeItem('token');
    this.cartService.clearCart();
    this.favoritesService.clearFavorites();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  checkLoginBeforeNavigate(category: string, event: Event) {
    const token = localStorage.getItem('token');
    if (!token) {
      event.preventDefault();
      this.showLoginPrompt = true;
      return;
    }
    this.show = 'hidden';
    this.router.navigate(['/' + category]);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  isLinkActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      matrixParams: 'ignored',
      queryParams: 'ignored',
      fragment: 'ignored',
    });
  }

  navigateTo(path: string) {
    this.show = 'hidden';
    this.router.navigate([path]);
  }

  
}
