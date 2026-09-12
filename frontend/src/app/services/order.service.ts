import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface CreateOrderRequest {
  table: number;
  items: CartItem[];
  description: string;
}

export interface OrderResponse {
  order_id: string;
  table_number: number;
  order_status: string;
  order_queue: string;
  order_payment: string;
  order_payment_amount: number;
  order_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentListResponse {
  orders: OrderResponse[];
  pending_count: number;
  pending_total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/api/orders', request);
  }

  getOrder(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`/api/orders/${orderId}`);
  }

  listPendingOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>('/api/orders');
  }

  approveOrder(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/orders/${orderId}/approve`, {});
  }

  listQueueOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>('/api/orders/queue');
  }

  serveOrder(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/orders/${orderId}/serve`, {});
  }

  listPendingPayments(): Observable<PaymentListResponse> {
    return this.http.get<PaymentListResponse>('/api/orders/payments');
  }

  markOrderPaid(orderId: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/orders/${orderId}/pay`, {});
  }

  listCompletedPayments(): Observable<PaymentListResponse> {
    return this.http.get<PaymentListResponse>('/api/orders/payments/completed-today');
  }
}
