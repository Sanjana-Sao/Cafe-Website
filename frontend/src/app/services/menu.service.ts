import { Injectable } from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  getCategories(): MenuCategory[] {
    return [
      {
        id: 'coffee',
        name: 'Signature Coffee',
        description: 'Ethically sourced, locally roasted beans.',
        items: [
          { id: 'c1', name: 'Oasis Cappuccino', description: 'Rich espresso balanced with micro-foam', price: 4.5 },
          { id: 'c2', name: 'Iced Vanilla Latte', description: 'Chilled espresso over ice', price: 5.25 },
          { id: 'c3', name: 'Single Origin Espresso', description: 'A vibrant concentrated shot', price: 3.5 }
        ]
      },
      {
        id: 'pastries',
        name: 'Pastries',
        description: 'Freshly baked daily',
        items: [
          { id: 'p1', name: 'Almond Croissant', description: 'Warmed', price: 6.0 },
          { id: 'p2', name: 'Blueberry Muffin', description: 'Sweet and soft', price: 3.5 }
        ]
      },
      {
        id: 'brunch',
        name: 'Brunch',
        description: 'Hearty dishes for daytime',
        items: [
          { id: 'b1', name: 'Avocado Toast', description: 'Sourdough, smashed avo', price: 8.5 }
        ]
      }
    ];
  }
}
