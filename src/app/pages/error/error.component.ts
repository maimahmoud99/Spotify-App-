import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,RouterModule],
  templateUrl: './error.component.html',
  
})
export class ErrorComponent implements OnInit {
  errorMessage: string = 'An unexpected error occurred';

  constructor(private router: Router) {}

  ngOnInit(): void {

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['errorMessage']) {
    
      this.errorMessage = navigation.extras.state['errorMessage'];
    }
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}
