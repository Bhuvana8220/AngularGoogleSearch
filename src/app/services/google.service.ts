import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GoogleService {
  constructor(private httpClient: HttpClient) { }

  private searchUrl = 'https://www.google.com/search?q=';

  getResult(query: string, start: number = 0): Observable<string[]> {
    return this.httpClient.get(`${this.searchUrl + query + '&start=' + start}`, {
      responseType: 'text'
    }).pipe(
      map((response) => {
        // console.log(response);
        const tempElement = document.createElement('div');
        tempElement.innerHTML = response;
        const responseTitleTags = tempElement.querySelectorAll('[role="main"] h3');
        const titles: string[] = [];
        if (responseTitleTags && responseTitleTags.length > 0) {
          responseTitleTags.forEach((titleTag) => {
            titles.push(titleTag.textContent);
          });
        }
        return titles;
      })
    );
  }
}
