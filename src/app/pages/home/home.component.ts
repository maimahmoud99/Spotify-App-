import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { ServicesComponent } from '../../components/services/services.component';
import { PartnersComponent } from '../../components/partners/partners.component';
import { RunningManComponent } from "../../components/running-man/running-man.component";
import { CategoriesComponent } from "../../components/categories/categories.component";
import { MenCollectionComponent } from '../../components/image-collection/men-collection.component';
import {  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',

  imports: [HeaderComponent,ServicesComponent,FooterComponent,PartnersComponent, RunningManComponent, CategoriesComponent],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const id = params['id'];
      const name = params['name'];
      const email = params['email'];
      const role = params['role'];
      if (token) {
        console.log('Token from Google:', token);
        localStorage.setItem('token', token);
        localStorage.setItem('UserId', id || '');
        localStorage.setItem('Fname', name || '');
        localStorage.setItem('Email', email || '');
        localStorage.setItem('role', role || '');

        
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });

        
      }
    });
  }
}