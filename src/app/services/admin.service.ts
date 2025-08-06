// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from './auth/authservice/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/products';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  // to add a product
  addProduct(product: any) {
    const headers = this.authService.getAuthHeaders();
    return this.http
      .post(`${this.apiUrl}`, product, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    const errorMessage = error.message || 'Something went wrong!';
    this.router.navigate(['/error'], {
      state: { errorMessage },
    });

    return throwError(() => new Error(errorMessage));
  }

  // to delete product
  deleteProduct(productId: string) {
    const headers = this.authService.getAuthHeaders();
    return this.http
      .delete(`${this.apiUrl}/${productId}`, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }
  editProduct(productId: string, productData: any) {
    const headers = this.authService.getAuthHeaders();
    return this.http
      .patch<any>(`${this.apiUrl}/${productId}`, productData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating product:', error);
          throw error;
        })
      );
  }

  getProductById(productId: string) {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${productId}`, { headers });
  }
}
