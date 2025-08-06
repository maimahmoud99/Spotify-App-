import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  allCategories: { name: string; img: string; src: string }[] = [
    { name: 'MAN', img: 'assets/images/man_categories.svg', src: '/men' },
    { name: 'WOMEN', img: 'assets/images/women_categories.svg', src: '/women' },
    { name: 'SHOES', img: 'assets/images/shoes_categories.svg', src: '/shoes' },
    { name: 'SUPPLEMENTS', img: 'assets/images/supplements_categorie.svg', src: '/supplements' },
    { name: 'EQUIPMENTS', img: 'assets/images/equipments.svg', src: '/equipment' },
  ];

  displayedCategories: { name: string; img: string; src: string }[] = [];

  firstElement: number = 0;
  itemsPerPage: number = this.calculateItemsPerPage(); // Calculate items per page based on screen size
  disableLeft: boolean = true;
disableRight: boolean = false;
showLoginPrompt = false;

  constructor(private router: Router) {
    this.updateDisplayedCategories();
    window.addEventListener('resize', () => {
      this.itemsPerPage = this.calculateItemsPerPage();
      this.resetFirstElement(); 
      this.updateDisplayedCategories();
    });
  }

 
  calculateItemsPerPage(): number {
    if (window.innerWidth < 768) {
      return 1;
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      return 2; 
    } else {
      return 3; 
    }
  }

  
  resetFirstElement(): void {
    if (this.firstElement + this.itemsPerPage > this.allCategories.length) {
      this.firstElement = Math.max(0, this.allCategories.length - this.itemsPerPage);
    }
  }

  updateDisplayedCategories(): void {
    this.displayedCategories = this.allCategories.slice(
      this.firstElement,
      this.firstElement + this.itemsPerPage
    );
    this.disableLeft = this.firstElement === 0;
  this.disableRight = this.firstElement + this.itemsPerPage >= this.allCategories.length;
  }

  moveRight(): void {
    if (this.firstElement + this.itemsPerPage < this.allCategories.length) {
      this.firstElement++;
      this.updateDisplayedCategories();
    }
   
    
  }

  moveLeft(): void {
    if (this.firstElement > 0) {
      
      this.firstElement--;
      this.updateDisplayedCategories();
    }
    
  }
navigateToCategory(path: string) {
  console.log('Navigating to:', path); 
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate([path]);
  } else {
    this.showLoginPrompt = true;
  }
}


navigateToLogin() {
  this.showLoginPrompt = false;
  this.router.navigate(['/login']);
}
}