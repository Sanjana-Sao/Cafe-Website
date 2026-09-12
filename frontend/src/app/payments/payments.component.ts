import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  orders: OrderResponse[] = [];
  pendingCount = 0;
  pendingTotal = 0;
  loading = false;
  error = '';
  paying = '';
  activeTab: 'pending' | 'completed' = 'pending';

  constructor(private orderService: OrderService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = '';
    this.orderService.listPendingPayments().subscribe({
      next: (result) => {
        this.orders = result.orders;
        this.pendingCount = result.pending_count;
        this.pendingTotal = result.pending_total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load pending payments.';
      }
    });
  }

  markAsPaid(order: OrderResponse): void {
    this.paying = order.order_id;
    this.orderService.markOrderPaid(order.order_id).subscribe({
      next: () => {
        this.paying = '';
        this.loadPayments();
      },
      error: () => {
        this.paying = '';
        this.error = 'Unable to mark this order as paid.';
      }
    });
  }

  showCompleted(): void {
    this.activeTab = 'completed';
    this.loading = true;
    this.error = '';
    this.orderService.listCompletedPayments().subscribe({
      next: (result) => {
        this.orders = result.orders;
        this.pendingCount = result.orders.length;
        this.pendingTotal = result.orders.reduce(
          (total, order) => total + order.order_payment_amount, 0
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load completed payments.';
      }
    });
  }

  showPending(): void {
    this.activeTab = 'pending';
    this.loadPayments();
  }
}
