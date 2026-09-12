import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
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

  placingOrder = false;
  orderError = '';

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    if (this.placingOrder || !this.table || !this.items.length) {
      return;
    }

    this.placingOrder = true;
    this.orderError = '';
    const items = this.items.map((item) => ({ ...item }));
    const description = JSON.stringify(items);

    this.orderService.createOrder({ table: this.table, items, description }).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/order-pending'], {
          queryParams: { orderId: order.order_id }
        });
      },
      error: () => {
        this.placingOrder = false;
        this.orderError = 'Unable to place your order. Please try again.';
      }
    });
  }

  goToMenu() {
    this.router.navigate(['/menu'], { queryParams: { table: this.table } });
  }
}
