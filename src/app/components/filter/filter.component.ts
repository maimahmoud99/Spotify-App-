import { CommonModule } from '@angular/common';
import { Component, Input ,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
    isHidden: boolean = true;
  hideBrand: boolean = true;
  hideBrice: boolean = false;
  selectedButton: string = 'price';
  brand: string = '';
  sort: string='';
  selectedIndex: number | null = null; 
  priceindex:number|null=null;
  @Input() infoBrand:any; 
  @Output() filterChanged = new EventEmitter<{ sort: string; brand: string }>();
  constructor(){console.log(this.infoBrand)}
  toggelFilter() {
    this.isHidden = !this.isHidden;
  }
  // brandChecked(index: number, brand: string) {
  //   this.selectedIndex = this.selectedIndex =index;
  //   this.brand = brand;
  //   this.filterChanged.emit({ sort: this.sort, brand: this.brand }); 
  // }
  
  brandChecked(index: number, brand: string) {
  if (this.selectedIndex === index) {
    // إلغاء التحديد
    this.selectedIndex = null;
    this.brand = '';
  } else {
    this.selectedIndex = index;
    this.brand = brand;
  }
  // this.filterChanged.emit({ sort: this.sort, brand: this.brand });
}

  // priceChecked(index: number, sort: string) {
  //   this.priceindex = this.priceindex =index;
  //   this.sort = sort === 'hight' ? '-price' : 'price';
  //   this.filterChanged.emit({ sort: this.sort, brand: this.brand }); 
  // }
  
  priceChecked(index: number, sort: string) {
  if (this.priceindex === index) {
    // إلغاء التحديد
    this.priceindex = null;
    this.sort = '';
  } else {
    this.priceindex = index;
    this.sort = sort === 'hight' ? '-price' : 'price';
  }
  // this.filterChanged.emit({ sort: this.sort, brand: this.brand });
}

  show(text: string) {
    this.selectedButton = text;
    this.hideBrand = text !== 'brand';
    this.hideBrice = text !== 'price';
  } 
  
//   resetFilters() {
//   this.selectedIndex = null;
//   this.priceindex = null;
//   this.brand = '';
//   this.sort = '';
//   this.selectedButton = 'price';
//   this.hideBrand = true;
//   this.hideBrice = false;

//   this.filterChanged.emit({ sort: '', brand: '' });
// }
applyFilters() {
  this.filterChanged.emit({ sort: this.sort, brand: this.brand });
  this.isHidden = true;
}


}
