import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import {
  form,
  FormField,
  FormRoot,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';

import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';

interface ResetPasswordFormModel {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password-page',

  imports: [FormField, FormRoot, RouterLink, ButtonModule, InputTextModule],

  templateUrl: './reset-password-page.html',

  styleUrl: '../auth-recovery.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage {
  readonly token = input.required<string>();

  readonly passwordVisible = signal(false);

  readonly confirmPasswordVisible = signal(false);

  readonly passwordChanged = signal(false);

  readonly resetPasswordModel = signal<ResetPasswordFormModel>({
    password: '',
    confirmPassword: '',
  });

  readonly resetPasswordForm = form(
    this.resetPasswordModel,

    (schemaPath) => {
      required(schemaPath.password, {
        message: 'Password is required.',
      });

      minLength(schemaPath.password, 8, {
        message: 'Password must contain at least 8 characters.',

        when: ({ value }) => value().length > 0,
      });

      pattern(schemaPath.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Include uppercase, lowercase and a number.',

        when: ({ value }) => value().length >= 8,
      });

      required(schemaPath.confirmPassword, {
        message: 'Confirm your password.',
      });

      validate(
        schemaPath.confirmPassword,

        ({ value, valueOf }) => {
          const confirmPassword = value();

          if (!confirmPassword) {
            return null;
          }

          const password = valueOf(schemaPath.password);

          if (password === confirmPassword) {
            return null;
          }

          return {
            kind: 'passwordMismatch',

            message: 'Passwords do not match.',
          };
        },
      );
    },

    {
      submission: {
        action: async (field) => {
          const request = {
            token: this.token(),

            password: field().value().password,

            confirmPassword: field().value().confirmPassword,
          };

          /*
           * Temporary frontend behavior.
           *
           * This will be replaced by:
           * POST /api/auth/reset-password
           */
          console.log('Reset password request:', request);

          this.passwordChanged.set(true);
        },

        onInvalid: (field) => {
          field().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
      },
    },
  );

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((visible) => !visible);
  }
}
