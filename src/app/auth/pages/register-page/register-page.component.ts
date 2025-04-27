import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  hasError = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if ( this.registerForm.invalid ) {
      this.setHasError();
      return;
    }

    const {email = '', password = '', fullName = ''} = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe((isValid) => {
      if (isValid) {
        this.router.navigateByUrl('/');
      }

      this.setHasError();
    })
  }

  setHasError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
  }
}
