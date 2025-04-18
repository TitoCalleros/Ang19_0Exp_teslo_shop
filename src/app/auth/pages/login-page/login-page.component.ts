import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  authSvc = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  formUtils = FormUtils;

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if( this.loginForm.invalid) {
      this.setHasError();
      return;
    }

    const {email  = '', password = ''} = this.loginForm.value;

    this.authSvc.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }

      this.setHasError();
    });
  }

  setHasError() {
    this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
  }

}
