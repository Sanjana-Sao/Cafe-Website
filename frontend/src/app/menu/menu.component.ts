import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService, MenuCategory, MenuItem } from '../services/menu.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  categories: MenuCategory[] = [];
  activeIndex = 0;
  table = 0;

  constructor(
    private menuSvc: MenuService,
    public cart: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.menuSvc.getCategories();
    this.route.queryParams.subscribe((q) => {
      this.table = +q['table'] || 0;
    });
  }

  add(item: MenuItem) {
    this.cart.addItem(item);
  }

  viewCart() {
    this.router.navigate(['/cart'], { queryParams: { table: this.table } });
  }
}
