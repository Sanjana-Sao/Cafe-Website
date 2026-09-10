import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-entry',
  templateUrl: './table-entry.component.html',
  styleUrls: ['./table-entry.component.css']
})
export class TableEntryComponent {
  tableNumber = '';
  constructor(private router: Router) {}
  go() {
    const n = parseInt(this.tableNumber as any, 10) || 0;
    this.router.navigate(['/menu'], { queryParams: { table: n } });
  }
}
