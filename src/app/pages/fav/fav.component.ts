import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-fav',
  imports: [
    HeaderComponent,
    ProductCardComponent,
    FooterComponent,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './fav.component.html',
  styleUrl: './fav.component.css',
})
export class FavComponent {
  favorites: any[] = [];
  isLoading: boolean = false;
  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.favoritesService.favoriteItems$.subscribe({
      next: (items) => {
        this.favorites = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });

    this.favoritesService.initializeFavorites();
  }
  removeFromFavorites(itemId: string) {
    this.favoritesService.removeFavorite(itemId).subscribe({
      next: () => {
        console.log(`${itemId} removed from favorites`);
        this.favorites = this.favorites.filter((item) => item.id !== itemId);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }
}
