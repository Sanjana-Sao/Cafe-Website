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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((q) => {
      this.table = +q['table'] || 0;
      this.total = +q['total'] || 0;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
