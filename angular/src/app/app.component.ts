import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { logout, removeError } from "@app/store/auth/login.actions";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { selectIsAuthenticated, selectUser } from "@app/store/auth/login.selectors";
import { MatButton } from "@angular/material/button";
import { AuthState, User } from "@app/models/auth.model";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButton,
    RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Home';
  store: Store<AuthState> = inject(Store);
  isAuthenticated$: Observable<boolean> = this.store.pipe(select(selectIsAuthenticated));
  user$: Observable<User> = this.store.pipe(select(selectUser));

  logout() {
    this.store.dispatch(logout());
  }

  onRouteChange() {
    this.store.dispatch(removeError());
  }

}
