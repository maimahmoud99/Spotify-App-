import { Component, ErrorHandler } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalErrorHandler } from './services/error_handler/error-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CartService } from './services/products/cart.service';
import { FavoritesService } from './services/favorites/favorites.service';

@Component({
  selector: 'app-root',

  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],

  imports: [RouterOutlet, CommonModule, RouterOutlet, CommonModule],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sports';

  constructor(
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.cartService.getCartProducts().subscribe();
    this.cartService.refreshCartCount();
    this.favoritesService.initializeFavorites();
  }
}
