import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from "@angular/common";
import { login } from '@app/store/auth/login.actions';
import { selectError, selectIsLoading } from '@app/store/auth/login.selectors';
import { MatCardModule} from "@angular/material/card";
import { MatError, MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { Observable } from "rxjs";
import { AuthState } from "@app/models/auth.model";

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatCardModule,
    MatError,
    MatFormField,
    MatInputModule
  ],
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  store: Store<AuthState> = inject(Store);
  error$: Observable<string> = this.store.pipe(select(selectError));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  submitted: boolean = false;
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(login({
      email: this.f['email'].value,
      password: this.f['password'].value,
    }));

  }
}
