# Frontend (Angular) — setup and example

This project uses an Angular frontend that calls the backend Fibonacci API at `/api/fibonacci?n=...`.

Quick steps to create and run the Angular app locally:

1. Install Angular CLI (if you don't have it):

```bash
npm install -g @angular/cli
```

2. Create a new Angular app inside the `frontend/` folder (name it `fibonacci-app`):

```bash
cd frontend
ng new fibonacci-app --routing=false --style=css
cd fibonacci-app
```

3. Add a simple service and component to call the backend API.

Files to create/replace in `frontend/fibonacci-app/src/app/`:

- `fibonacci.service.ts`:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FibonacciService {
  constructor(private http: HttpClient) {}
  getFibonacci(n: number): Observable<number[]> {
    return this.http.get<number[]>(`/api/fibonacci?n=${n}`);
  }
}
```

- `app.component.ts` (replace default):

```ts
import { Component } from '@angular/core';
import { FibonacciService } from './fibonacci.service';

@Component({
  selector: 'app-root',
  template: `
    <div style="padding:1rem">
      <h1>Fibonacci (Angular)</h1>
      <label>Count: <input type="number" [(ngModel)]="count" /></label>
      <button (click)="load()">Load</button>
      <pre *ngIf="seq">{{ seq | json }}</pre>
    </div>
  `,
})
export class AppComponent {
  count = 10;
  seq: number[] | null = null;
  constructor(private svc: FibonacciService) {}
  load() {
    this.svc.getFibonacci(this.count).subscribe((data) => (this.seq = data));
  }
}
```

4. Make sure `HttpClientModule` and `FormsModule` are imported in `app.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

5. Proxy backend calls in development by creating `proxy.conf.json` in the `fibonacci-app` folder:

```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Then run the dev server with the proxy:

```bash
ng serve --proxy-config proxy.conf.json
```

6. Run the backend API in parallel:

```bash
cd ../../backend
python -m pip install -r requirements.txt
python app.py
```

Now open `http://localhost:4200` and use the UI to fetch Fibonacci numbers.

If you'd rather have me scaffold the Angular project files directly in this workspace, tell me and I'll create them (it will be many files). 
