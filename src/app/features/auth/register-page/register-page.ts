import { Component, inject, signal } from '@angular/core';

import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';

import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface RegisterFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-page',

  imports: [FormField, FormRoot, RouterLink, ButtonModule, InputTextModule],

  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly router = inject(Router);

  readonly passwordVisible = signal(false);

  readonly confirmPasswordVisible = signal(false);

  /*
   * ده مصدر الحقيقة الوحيد لقيم الـForm.
   *
   * أي تغيير في الـInputs يحدث هذا الـSignal،
   * وأي تغيير في الـSignal يظهر في الـInputs.
   */
  readonly registerModel = signal<RegisterFormModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  /*
   * form() تنشئ FieldTree مكتوبة بالـTypeScript
   * بنفس شكل registerModel.
   */
  readonly registerForm = form(
    this.registerModel,

    (schemaPath) => {
      /*
       * First Name
       */

      required(schemaPath.firstName, {
        message: 'First name is required.',
      });

      minLength(schemaPath.firstName, 2, {
        message: 'First name must contain at least 2 characters.',

        when: ({ value }) => value().length > 0,
      });

      maxLength(schemaPath.firstName, 50, {
        message: 'First name cannot exceed 50 characters.',
      });

      /*
       * Last Name
       */

      required(schemaPath.lastName, {
        message: 'Last name is required.',
      });

      minLength(schemaPath.lastName, 2, {
        message: 'Last name must contain at least 2 characters.',

        when: ({ value }) => value().length > 0,
      });

      maxLength(schemaPath.lastName, 50, {
        message: 'Last name cannot exceed 50 characters.',
      });

      /*
       * Email
       */

      required(schemaPath.email, {
        message: 'Email address is required.',
      });

      email(schemaPath.email, {
        message: 'Enter a valid email address.',
      });

      /*
       * Password
       */

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

      /*
       * Confirm Password
       */

      required(schemaPath.confirmPassword, {
        message: 'Confirm your password.',
      });

      /*
       * Cross-field Validation.
       *
       * بنقارن confirmPassword بقيمة password.
       * الـValidator يعاد تشغيله تلقائيًا عند تغيير
       * أي قيمة منهما.
       */
      validate(
        schemaPath.confirmPassword,

        ({ value, valueOf }) => {
          const confirmPassword = value();

          /*
           * required() مسؤولة عن حالة الحقل الفارغ،
           * فلا نعرض رسالتين في نفس الوقت.
           */
          if (!confirmPassword) {
            return null;
          }

          const password = valueOf(schemaPath.password);

          if (confirmPassword === password) {
            return null;
          }

          return {
            kind: 'passwordMismatch',
            message: 'Passwords do not match.',
          };
        },
      );

      /*
       * Terms.
       *
       * required() تعتبر false قيمة فارغة،
       * ولذلك يجب تحديد الـCheckbox.
       */
      required(schemaPath.acceptTerms, {
        message: 'You must accept the terms and conditions.',
      });
    },

    {
      submission: {
        action: async (field) => {
          const formValue = field().value();

          /*
           * ده شكل الـRequest المتوافق مع
           * Register API المخطط لها.
           *
           * acceptTerms خاصة بالواجهة فقط،
           * ولذلك لا نرسلها للـBackend.
           */
          const registerRequest: RegisterRequest = {
            firstName: formValue.firstName.trim(),

            lastName: formValue.lastName.trim(),

            email: formValue.email.trim().toLowerCase(),

            password: formValue.password,

            confirmPassword: formValue.confirmPassword,
          };

          /*
           * مؤقتًا لحين ربط .NET API.
           */
          console.log('Register request:', registerRequest);

          /*
           * بعد التسجيل ننتقل إلى Login.
           *
           * لاحقًا مكان console.log سنستدعي
           * POST /api/auth/register.
           */
          await this.router.navigateByUrl('/auth/login');
        },
      },
    },
  );

  togglePasswordVisibility(): void {
    this.passwordVisible.update((currentValue) => !currentValue);
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((currentValue) => !currentValue);
  }
}
