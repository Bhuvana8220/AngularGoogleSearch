import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  $error = new BehaviorSubject('');

  constructor() { }

  showError(message: string) {
    this.$error.next(message);
  }

  hideError() {
    this.$error.next('');
  }
}
