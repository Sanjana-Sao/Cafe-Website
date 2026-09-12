import { Component, OnInit } from '@angular/core';
import { OrderResponse, OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  orders: OrderResponse[] = [];
  period: 'today' | 'week' | 'month' = 'today';
  loading = false;
  error = '';

  constructor(private orderService: OrderService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  get totalRevenue(): number {
    return this.orders.reduce((total, order) => total + order.order_payment_amount, 0);
  }

  get ordersCompleted(): number {
    return this.orders.length;
  }

  get averageWaitTime(): string {
    if (!this.orders.length) {
      return '0m 0s';
    }

    const totalSeconds = this.orders.reduce((total, order) => {
      const created = new Date(order.created_at).getTime();
      const completed = new Date(order.updated_at).getTime();
      return total + Math.max(0, (completed - created) / 1000);
    }, 0);
    const averageSeconds = Math.round(totalSeconds / this.orders.length);
    return `${Math.floor(averageSeconds / 60)}m ${averageSeconds % 60}s`;
  }

  get topItem(): { name: string; quantity: number } {
    const itemCounts = new Map<string, number>();
    this.orders.forEach((order) => {
      try {
        const items = JSON.parse(order.order_description || '[]') as Array<{ name?: string; quantity?: number }>;
        items.forEach((item) => {
          if (item.name) {
            itemCounts.set(item.name, (itemCounts.get(item.name) || 0) + (item.quantity || 0));
          }
        });
      } catch {
        // Ignore an order with an older non-JSON description.
      }
    });

    let result = { name: 'No items yet', quantity: 0 };
    itemCounts.forEach((quantity, name) => {
      if (quantity > result.quantity) {
        result = { name, quantity };
      }
    });
    return result;
  }

  selectPeriod(period: 'today' | 'week' | 'month'): void {
    this.period = period;
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.error = '';
    this.orderService.listCompletedPayments().subscribe({
      next: (result) => {
        this.orders = result.orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load sales data.';
      }
    });
  }

  exportReport(): void {
    const rows = [
      ['Order ID', 'Table', 'Amount', 'Completed At'],
      ...this.orders.map((order) => [
        order.order_id,
        String(order.table_number),
        order.order_payment_amount.toFixed(2),
        order.updated_at
      ])
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `sales-${this.period}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
