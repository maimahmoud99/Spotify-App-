import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/authservice/auth.service';
import { UserService } from '../../services/auth/user.service';
import { LogoutModalComponent } from '../../components/logout-modal/logout-modal.component';
import { CartService } from '../../services/products/cart.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, LogoutModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
   userData: any = {}; 
  @ViewChild(LogoutModalComponent) logoutModalRef!: LogoutModalComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

 logout() {
  this.authService.signout();
  this.router.navigate(['/home'], { replaceUrl: true });
  localStorage.removeItem('cart');
  this.cartService.clearCart();
  this.favoritesService.clearFavorites();
  
}


  ngOnInit(): void {
  const userId = localStorage.getItem('UserId');
  if (userId) {
    this.authService.getuser(userId).subscribe({
      next: (res: any) => {
        this.userData = res.data.user;
        console.log(res.data.user);
        this.userService.setUserData(this.userData); 
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.router.navigate(['/error'], { replaceUrl: true }); 
      }
    });
  } else {
      this.router.navigate(['/error'], { replaceUrl: true }); 
    }
}
  openLogoutModal() {
    this.logoutModalRef.open();
  }

  handleLogout() {
    this.authService.signout();
    this.router.navigate(['/home'], { replaceUrl: true });
    localStorage.removeItem('cart');
    this.cartService.clearCart();
    this.favoritesService.clearFavorites();
  }

}
