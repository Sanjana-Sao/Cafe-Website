import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, OrderResponse } from '../services/order.service';
import { CartItem } from '../services/cart.service';

@Component({
  selector: 'app-order-pending',
  templateUrl: './order-pending.component.html',
  styleUrls: ['./order-pending.component.css']
})
export class OrderPendingComponent implements OnInit {
  table = 0;
  amount = 0;
  orderId = '';
  status = '';
  queue = '';
  payment = '';
  items: CartItem[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      this.orderId = query['orderId'] || '';
      if (!this.orderId) {
        this.loading = false;
        this.error = 'Order ID is missing.';
        return;
      }

      this.orderService.getOrder(this.orderId).subscribe({
        next: (order) => this.setOrder(order),
        error: () => {
          this.loading = false;
          this.error = 'Unable to load your order. Please refresh the page.';
        }
      });
    });
  }

  private setOrder(order: OrderResponse): void {
    this.table = order.table_number;
    this.amount = order.order_payment_amount;
    this.status = order.order_status;
    this.queue = order.order_queue;
    this.payment = order.order_payment;
    this.items = this.parseItems(order.order_description);
    this.loading = false;
  }

  private parseItems(description?: string): CartItem[] {
    if (!description) {
      return [];
    }
    try {
      const parsed = JSON.parse(description);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  addMoreItems(): void {
    this.router.navigate(['/menu'], { queryParams: { table: this.table } });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
