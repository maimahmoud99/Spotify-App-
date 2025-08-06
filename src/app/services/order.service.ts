import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `http://127.0.0.1:8000/orders`;

  constructor(private http: HttpClient) {}

  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Order API Error:', error);
    return throwError(
      () => new Error(error.message || 'Something went wrong!')
    );
  }

  // Create New Order
  createOrder(orderData: {
    items: any[];
    paymentMethod: string;
    shippingAddress: {
      address: string;
      city: string;
      country: string;
      postalCode: string;
      phone: string;
    };
  }): Observable<any> {
    return this.http
      .post(this.apiUrl, orderData, { headers: this.getHeader() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Get All Orders (admin)
  getAllOrders(
    status?: string,
    page: number = 1,
    limit: number = 8
  ): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http
      .get(url, { headers: this.getHeader() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Get My Orders (logged-in user)
  getMyOrders(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/my-orders`, { headers: this.getHeader() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Get Order by ID
  getOrderById(orderId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${orderId}`, { headers: this.getHeader() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Update Order Status (admin)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http
      .patch(
        `${this.apiUrl}/${orderId}`,
        { status },
        { headers: this.getHeader() }
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Delete Order (admin)
  deleteOrder(orderId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${orderId}`, { headers: this.getHeader() })
      .pipe(catchError((error) => this.handleError(error)));
  }
}
