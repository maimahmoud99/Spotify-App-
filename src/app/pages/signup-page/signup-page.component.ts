// 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  isvisble = false;
  isvisble2 = false;
  submitted = false;
  errorMsg: string = '';
  isLoading = false;

  signUpPage!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
     private toastr: ToastrService 
  ) {
    
    // إنشاء الفورم
    this.signUpPage = this.fb.group({
firstName: [
    '',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/)  
    ],
  ],
  lastName: [
    '',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/)  
    ],
  ],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      ]],
      password: ['', [Validators.minLength(8), Validators.required]],
      passwordConfirm: ['', [Validators.required]],
      rememberMe: [false]
    });

    // ربط الـ validator الخاص بتطابق الباسورد
    this.signUpPage.get('passwordConfirm')?.setValidators([
      Validators.required,
      confirmPasswordValidator(this.signUpPage.get('password') as FormControl)
    ]);

    // تحديث الفاليديشن لما الباسورد يتغير
    this.signUpPage.get('password')?.valueChanges.subscribe(() => {
      this.signUpPage.get('passwordConfirm')?.updateValueAndValidity();
    });
  }

  toggleEye() {
    this.isvisble = !this.isvisble;
  }

  toggleEye2() {
    this.isvisble2 = !this.isvisble2;
  }

  // onSubmit() {
  //   this.submitted = true;
  //   this.signUpPage.updateValueAndValidity();

  //   if (this.signUpPage.invalid) {
  //     this.signUpPage.markAllAsTouched();
  //     return;
  //   }

  //   if (this.signUpPage.valid) {
  //     console.log("done");
  //     this.authService.signup(this.signUpPage.value).subscribe({
  //       next: (res) => {
  //         if (res.token) {
  //           localStorage.setItem('token', res.token);
  //           this.router.navigate(["/login"], { replaceUrl: true });
  //         } else {
  //           console.log("no token");
  //         }
  //       },
  //       error: (err) => {
  //         this.errorMsg = err.error.message || "unexpected error";
  //       }
  //     });
  //   } else {
  //     console.log("empty");
  //   }
  // }
onSubmit() {
  this.submitted = true;
  this.signUpPage.updateValueAndValidity();

  if (this.signUpPage.invalid) {
    this.signUpPage.markAllAsTouched();
    return;
  }

  if (this.signUpPage.valid) {
    this.isLoading = true;

    this.authService.signup(this.signUpPage.value).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.token) {
          localStorage.setItem('token', res.token);
          // this.toastr.success('Account created successfully!', 'Success');
          this.router.navigate(["/login"], { replaceUrl: true });
        } else {
          this.toastr.warning('No token received from server.', 'Warning');
        }
      },
      error: (err) => {
        const msg = err.error.message || "Unexpected error occurred";
        this.toastr.error(msg, "Error", { timeOut: 3000 });
        this.isLoading = false;
      }
    });
  }
}


}

// ✅ Validator لتأكيد تطابق كلمة المرور
export const confirmPasswordValidator = (passwordControl: FormControl): ValidatorFn => {
  return (confirmPasswordControl: AbstractControl): ValidationErrors | null => {
    if (!passwordControl || !confirmPasswordControl) return null;
    return passwordControl.value === confirmPasswordControl.value
      ? null
      : { passwordsDoNotMatch: true };
  };


};
