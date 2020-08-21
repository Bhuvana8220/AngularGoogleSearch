import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { GoogleService } from './../../services/google.service';

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
  private currentPage = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly googleService: GoogleService,
    private readonly cdRef: ChangeDetectorRef
  ) {
  }

  showError(controlName: string, validator: string): boolean {
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
    this.dataLoading = true;
    let startIndex = 0;
    if (pageNumber === this.currentPage) {
      return;
    }
    this.currentPage = pageNumber;
    startIndex = (pageNumber - 1) * 10;
    this.googleService.getResult(this.searchForm.value.search, startIndex).subscribe((response) => {
      // console.log('Response', response);
      this.searchData = response;
      this.dataLoading = false;
      this.cdRef.markForCheck();
    });
  }

  searchPageChange(nextPage: number): void {
    this.getSearchResult(nextPage);
  }
}
