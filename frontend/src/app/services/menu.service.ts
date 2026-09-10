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
          { id: 'b1', name: 'Avocado Toast', description: 'Sourdough, smashed avo', price: 8.5 },
          { id: 'b2', name: 'Shakshuka', description: 'Baked eggs, spiced tomato, toasted sourdough', price: 11.5 },
          { id: 'b3', name: 'Buttermilk Pancakes', description: 'Seasonal berries, maple syrup, whipped cream', price: 10.0 },
          { id: 'b4', name: 'Breakfast Burrito', description: 'Scrambled eggs, beans, cheddar, salsa', price: 10.5 },
          { id: 'b5', name: 'Smoked Salmon Bagel', description: 'Cream cheese, capers, pickled onion', price: 12.0 },
          { id: 'b6', name: 'Mushroom Benedict', description: 'Poached eggs, roasted mushrooms, hollandaise', price: 12.5 },
          { id: 'b7', name: 'Granola Bowl', description: 'Greek yogurt, house granola, fresh fruit', price: 8.0 }
        ]
      }
    ];
  }
}
