import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <p-toast></p-toast>
    <app-header></app-header>
    <main>
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
})
export class AppComponent {}
