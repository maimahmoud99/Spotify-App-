import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favUrl = 'http://127.0.0.1:8000/favorites';

  private favoriteItemsSubject = new BehaviorSubject<any[]>([]);
  favoriteItems$ = this.favoriteItemsSubject.asObservable();

  private favoriteCountSubject = new BehaviorSubject<number>(0);
  favoriteCount$ = this.favoriteCountSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.initializeFavorites();
  }

  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Favorites error:', error);
    const errorMessage = error.message || 'Something went wrong!';
        // error---> nav to error page
    this.router.navigate(['/error'], {
    state: { errorMessage },
  });
    this.clearFavorites();
    return throwError(() => new Error(errorMessage));
  }

  initializeFavorites(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearFavorites();
      return;
    }

    this.getfavourite().subscribe({
      next: (items) => {
        this.favoriteItemsSubject.next(items);
        this.favoriteCountSubject.next(items.length);
      },
      error: (err) => {
        this.clearFavorites();
      },
    });
  }

  clearFavorites(): void {
    this.favoriteItemsSubject.next([]);
    this.favoriteCountSubject.next(0);
  }

  getfavourite(): Observable<any[]> {
    return this.http
      .get<{ status: string; results: number; data: any[] }>(this.favUrl, {
        headers: this.getHeader(),
      })
      .pipe(
        map((res) => res.data || []),
        catchError((error) => this.handleError(error))
      );
  }

  addFavorite(productId: string): Observable<any> {
    return this.http
      .patch(`${this.favUrl}/add`, { productId }, { headers: this.getHeader() })
      .pipe(
        tap(() => this.initializeFavorites()),
        catchError((error) => this.handleError(error))
      );
  }

  removeFavorite(productId: string): Observable<any> {
    return this.http
      .patch(
        `${this.favUrl}/remove`,
        { productId },
        { headers: this.getHeader() }
      )
      .pipe(
        tap(() => this.initializeFavorites()),
        catchError((error) => this.handleError(error))
      );
  }
}
