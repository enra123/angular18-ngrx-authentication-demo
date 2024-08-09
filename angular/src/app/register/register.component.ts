import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatError, MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { select, Store } from "@ngrx/store";
import { selectError, selectIsLoading } from "@app/store/auth/login.selectors";
import { register } from "@app/store/auth/login.actions";
import { Observable } from "rxjs";
import { AuthState } from "@app/models/auth.model";

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  store: Store<AuthState> = inject(Store);
  error$: Observable<string> = this.store.pipe(select(selectError));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  submitted: boolean = false;
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(32)]
    ]
  });

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.store.dispatch(register({
      email: this.f['email'].value,
      password: this.f['password'].value,
    }));

  }
}
