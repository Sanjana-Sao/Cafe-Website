import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

interface QueueOrder extends OrderResponse {
  items: Array<{ quantity: number; name: string; description?: string }>;
}

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  orders: QueueOrder[] = [];
  error = '';
  serving = '';

  constructor(private orderService: OrderService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.listQueueOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map((order) => ({
          ...order,
          items: this.parseItems(order.order_description)
        }));
      },
      error: () => (this.error = 'Unable to load the kitchen queue.')
    });
  }

  markAsServed(order: QueueOrder): void {
    this.serving = order.order_id;
    this.error = '';
    this.orderService.serveOrder(order.order_id).subscribe({
      next: () => {
        this.orders = this.orders.filter((item) => item.order_id !== order.order_id);
        this.serving = '';
      },
      error: () => {
        this.serving = '';
        this.error = 'Unable to mark this order as served.';
      }
    });
  }

  private parseItems(description?: string): QueueOrder['items'] {
    if (!description) return [];
    try {
      const items = JSON.parse(description);
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }
}
