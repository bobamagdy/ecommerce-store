import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  ApiErrorService
} from './core/services/api-error/api-error';

import {
  LoadingService
} from './core/services/loading/loading';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet
  ],

  templateUrl: './app.html',
  styleUrl: './app.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class App {
  readonly loadingService =
    inject(LoadingService);

  readonly apiErrorService =
    inject(ApiErrorService);
}