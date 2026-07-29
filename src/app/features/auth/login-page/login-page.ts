import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required
} from '@angular/forms/signals';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../../core/services/auth/auth';

interface LoginFormModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-page',

  imports: [
    FormField,
    FormRoot,
    RouterLink,
    ButtonModule,
    InputTextModule
  ],

  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  readonly passwordVisible = signal(false);

  /*
   * The form model is the single source of truth.
   * Every input change updates this signal automatically.
   */
  readonly loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
    rememberMe: false
  });

  /*
   * form() creates a typed FieldTree that matches
   * the structure of loginModel.
   */
  readonly loginForm = form(
    this.loginModel,

    (schemaPath) => {
      required(schemaPath.email, {
        message: 'Email address is required.'
      });

      email(schemaPath.email, {
        message: 'Enter a valid email address.'
      });

      required(schemaPath.password, {
        message: 'Password is required.'
      });

      minLength(schemaPath.password, 8, {
        message:
          'Password must contain at least 8 characters.'
      });
    },

    {
      submission: {
        action: async (field) => {
          const loginRequest =
            field().value();

          /*
           * Temporary front-end login.
           * This will be replaced by the .NET API later.
           */
          this.authService.login(
            loginRequest.rememberMe
          );

          const requestedUrl =
            this.route.snapshot.queryParamMap.get(
              'returnUrl'
            );

          /*
           * Only navigate to an internal Angular URL.
           */
          const returnUrl =
            requestedUrl &&
            requestedUrl.startsWith('/') &&
            !requestedUrl.startsWith('//')
              ? requestedUrl
              : '/';

          await this.router.navigateByUrl(
            returnUrl
          );
        },

        onInvalid: (field) => {
          const firstError =
            field().errorSummary()[0];

          firstError
            ?.fieldTree()
            .focusBoundControl();
        }
      }
    }
  );

  togglePasswordVisibility(): void {
    this.passwordVisible.update(
      (currentValue) => !currentValue
    );
  }
}