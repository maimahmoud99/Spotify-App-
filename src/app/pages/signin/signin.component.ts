import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/products/cart.service';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  isvisble = false;
  toggleEye() {
    this.isvisble = !this.isvisble;
  }
  signInPage = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    // email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/)]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.required,
    ]),
    rememberMe: new FormControl(false),
  });
  submitted = false;
  errorMsg: string = '';
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        console.log('✅ Token from Google:', token);
        localStorage.setItem('token', token);
      }
    });
  }

  signUpWithGoogle() {
    window.location.href = 'http://localhost:8000/auth/google';
  }

  onSubmit() {
    this.submitted = true;

    if (this.signInPage.valid) {
      this.isLoading = true;

      this.authService.signin(this.signInPage.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          if (response.token) {
            this.authService.saveTokenRole(
              response.token,
              response.data.user.role,
              response.data.user._id,
              response.data.user.firstName,
              response.data.user.email
            );
            this.cartService.refreshCartCount();
            this.favoritesService.initializeFavorites();
            const role = response.data.user.role;
            this.router.navigate([role === 'admin' ? '/admin' : '/home'], {
              replaceUrl: true,
            });
          } else {
            console.log('invalid||missing token');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('failed', error);
          this.toastr.error(
            error.error.message || 'Unexpected error',
            'Login Failed'
          );
        },
      });
    } else {
      console.log('form invalid');
    }
  }
}
