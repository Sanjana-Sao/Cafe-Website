import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items = this.cart.items;
  subtotal = 0;
  tax = 0;
  total = 0;
  table = 0;

  constructor(private cart: CartService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.calculate();
    this.cart.changes.subscribe(() => this.calculate());
    this.route.queryParams.subscribe((q) => (this.table = +q['table'] || 0));
  }

  calculate() {
    this.subtotal = this.cart.getSubtotal();
    this.tax = +(this.subtotal * 0.08).toFixed(2);
    this.total = +(this.subtotal + this.tax).toFixed(2);
  }

  placeOrder() {
    const total = this.total;
    const table = this.table;
    this.cart.clear();
    this.router.navigate(['/order-success'], { queryParams: { table, total } });
  }

  goToMenu() {
    this.router.navigate(['/menu'], { queryParams: { table: this.table } });
  }
}
