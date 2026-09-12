import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  table = 0;
  total = 0;
  orderId = '';
  status = '';
  queue = '';
  payment = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((q) => {
      this.table = +q['table'] || 0;
      this.total = +q['amount'] || 0;
      this.orderId = q['orderId'] || '';
      this.status = q['status'] || 'not_approve';
      this.queue = q['queue'] || 'preparing';
      this.payment = q['payment'] || 'pending';
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  addMoreItems() {
    this.router.navigate(['/menu'], { queryParams: { table: this.table } });
  }
}
