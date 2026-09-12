import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableEntryComponent } from './table-entry/table-entry.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { OrderPendingComponent } from './order-pending/order-pending.component';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { QueueComponent } from './queue/queue.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesComponent } from './sales/sales.component';
import { AuthComponent } from './auth/auth.component';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: '', component: TableEntryComponent },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'signup', component: AuthComponent, data: { mode: 'signup' } },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-pending', component: OrderPendingComponent },
  { path: 'pending-approval', component: PendingApprovalComponent, canActivate: [RoleGuard], data: { roles: ['staff', 'manager'] } },
  { path: 'queue', component: QueueComponent, canActivate: [RoleGuard], data: { roles: ['staff', 'manager'] } }
  ,{ path: 'payments', component: PaymentsComponent, canActivate: [RoleGuard], data: { roles: ['manager'] } }
  ,{ path: 'sales', component: SalesComponent, canActivate: [RoleGuard], data: { roles: ['manager'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
