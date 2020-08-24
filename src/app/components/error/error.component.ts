import { Component } from '@angular/core';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  message: string = '';
  constructor(private readonly errorService: ErrorService) { 
    this.errorService.$error.subscribe((errorMessage)=> {
      this.message = errorMessage;
    });
  }

  close(): void {
    this.errorService.hideError();
  }
}
