import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/authservice/auth.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  imageUrl: string;
  size_range: string[]; 
  category?: any;
  subCategory?: any;
  gender?: string;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = "http://127.0.0.1:8000/products";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router , private adminService: AdminService
  ) {}

  getProduct(filter: { [key: string]: any } = {}, page: number = 1, limit: number = 8): Observable<{ products: Product[], total: number }> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
  
    for (let key in filter) {
      if (filter[key] !== undefined && filter[key] !== null) {
        params = params.set(key, filter[key]);
      }
    }
  
    return this.http.get<{ status: string, results: number, numProducts: number, data: { products: Product[] } }>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (!response.data.products || response.data.products.length === 0) {
            throw new Error('No products found');
          }
          return {
            products: response.data.products,
            total: response.numProducts
          };
        }),
       
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            // Handle the 500 error specifically
            console.error('no data found');
            // You can display a specific message to the user here
            // For example, by returning an Observable with a special structure
            return throwError({ status: 500, message: 'A server error occurred. Please try again later.' });
          } else {
            // For other errors, delegate to your general error handler
            return this.handleError(error);
          }
        })
      );
  }

  // private handleError(error: HttpErrorResponse) {
  
  //   console.error('Error occurred:', error);
  //   const errorMessage = error.message || 'Something went wrong!';
  //   this.router.navigate(['/error'], {
  //     state: { errorMessage }
  //   });


  //   return throwError(() => new Error(errorMessage));
  // }

  private handleError(error: HttpErrorResponse) {
  console.error('Error occurred:', error);
  return throwError(() => error); // ارجعي الخطأ نفسه علشان الكومبوننت تتعامل معاه
}
  getProductById(_id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${_id}`).pipe(
      catchError((error) => this.handleError(error)) 
    );
  }

  getReviewsById(_id: string) {
    return this.http.get(`${this.apiUrl}/${_id}/reviews`).pipe(
      catchError((error) => this.handleError(error)) 
    );
  }

  addNewReview(_id: string, review: any) {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${_id}/reviews`, review, { headers }).pipe(
      catchError((error) => this.handleError(error)) 
    );
  }


}
