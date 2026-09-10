import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  items: CartItem[] = [];
  changes = new BehaviorSubject<void>(undefined);

  addItem(i: { id?: string; name: string; price: number }) {
    const id = i.id || i.name;
    const found = this.items.find((x) => x.id === id);
    if (found) {
      found.quantity += 1;
    } else {
      this.items.push({ id, name: i.name, price: i.price, quantity: 1 });
    }
    this.changes.next();
  }

  removeOne(id: string) {
    const found = this.items.find((x) => x.id === id);
    if (!found) return;
    found.quantity -= 1;
    if (found.quantity <= 0) {
      this.items = this.items.filter((x) => x.id !== id);
    }
    this.changes.next();
  }

  getQuantity(id: string) {
    const found = this.items.find((x) => x.id === id);
    return found ? found.quantity : 0;
  }

  getSubtotal() {
    return this.items.reduce((s, it) => s + it.price * it.quantity, 0);
  }

  clear() {
    this.items = [];
    this.changes.next();
  }
}
