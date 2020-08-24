import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GoogleService } from './../../services/google.service';
import { ErrorService } from '../../services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  searchForm: FormGroup = this.fb.group({
    search: new FormControl(null, [Validators.required])
  });
  dataLoading = false;
  searchData: string[];
  $subscription: Subscription;
  private currentPage = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly googleService: GoogleService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService
  ) {
  }

  showValidationError(controlName: string, validator: string): boolean {
    return this.searchForm.get(controlName).touched
      && this.searchForm.get(controlName).errors
      && this.searchForm.get(controlName).errors[validator];
  }

  searchDataTrackBy(index): number {
    return index;
  }

  onSearchSubmit(): void {
    this.currentPage = 0;
    this.getSearchResult(1);
  }

  private getSearchResult(pageNumber: number): void {
    this.errorService.hideError();
    this.dataLoading = true;
    let startIndex = 0;
    if (pageNumber === this.currentPage) {
      return;
    }
    this.currentPage = pageNumber;
    startIndex = (pageNumber - 1) * 10;
    this.$subscription = this.googleService.getResult(this.searchForm.value.search, startIndex).subscribe((response) => {
      this.searchData = response;
      this.dataLoading = false;
      this.cdRef.markForCheck();
    }, (err) => {
      this.errorService.showError('Something went wrong!!! This could be propably due to CORS issue. Please enable CORS in your browser.');
      this.dataLoading = false;
      this.cdRef.markForCheck();
    });
  }

  searchPageChange(nextPage: number): void {
    this.getSearchResult(nextPage);
  }

  ngDestroy() {
    this.$subscription.unsubscribe();
  }
}
