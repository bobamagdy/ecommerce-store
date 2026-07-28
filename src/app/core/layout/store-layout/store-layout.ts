import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { StoreFooter } from '../store-footer/store-footer';
import { StoreHeader } from '../store-header/store-header';

@Component({
  selector: 'app-store-layout',

  imports: [
    RouterOutlet,
    StoreHeader,
    StoreFooter
  ],

  templateUrl: './store-layout.html',
  styleUrl: './store-layout.scss'
})
export class StoreLayout {}