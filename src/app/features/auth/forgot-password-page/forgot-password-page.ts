import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';

import {
  email,
  form,
  FormField,
  FormRoot,
  required
} from '@angular/forms/signals';

import {
  RouterLink
} from '@angular/router';

import {
  ButtonModule
} from 'primeng/button';

import {
  InputTextModule
} from 'primeng/inputtext';

interface ForgotPasswordFormModel {
  email: string;
}

@Component({
  selector:
    'app-forgot-password-page',

  imports: [
    FormField,
    FormRoot,
    RouterLink,
    ButtonModule,
    InputTextModule
  ],

  templateUrl:
    './forgot-password-page.html',

  styleUrl:
    '../auth-recovery.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPage {
  readonly requestSent =
    signal(false);

  readonly forgotPasswordModel =
    signal<ForgotPasswordFormModel>({
      email: ''
    });

  readonly forgotPasswordForm =
    form(
      this.forgotPasswordModel,

      (schemaPath) => {
        required(
          schemaPath.email,
          {
            message:
              'Email address is required.'
          }
        );

        email(
          schemaPath.email,
          {
            message:
              'Enter a valid email address.'
          }
        );
      },

      {
        submission: {
          action: async (field) => {
            const request = {
              email:
                field()
                  .value()
                  .email
                  .trim()
                  .toLowerCase()
            };

            /*
             * Temporary frontend behavior.
             *
             * This will be replaced by:
             * POST /api/auth/forgot-password
             */
            console.log(
              'Forgot password request:',
              request
            );

            this.requestSent.set(true);
          },

          onInvalid: (field) => {
            field()
              .errorSummary()[0]
              ?.fieldTree()
              .focusBoundControl();
          }
        }
      }
    );
}