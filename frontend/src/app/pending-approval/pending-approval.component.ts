import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface DisplayOrder extends OrderResponse {
  items: Array<{ quantity: number; name: string; description?: string; price: number }>;
}

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent implements OnInit {
  orders: DisplayOrder[] = [];
  loading = false;
  error = '';
  approving = '';

  constructor(private orderService: OrderService, private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  approve(order: DisplayOrder): void {
    this.approving = order.order_id;
    this.orderService.approveOrder(order.order_id).subscribe({
      next: () => {
        this.approving = '';
        this.router.navigate(['/queue']);
      },
      error: () => {
        this.approving = '';
        this.error = 'Unable to approve this order.';
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    this.orderService.listPendingOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map((order) => ({
          ...order,
          items: this.parseItems(order.order_description)
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load pending orders.';
      }
    });
  }

  private parseItems(description?: string): DisplayOrder['items'] {
    if (!description) {
      return [];
    }
    try {
      const items = JSON.parse(description);
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }
}
