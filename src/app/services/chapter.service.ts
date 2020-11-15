import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Chapter } from '../models/interfaces';
import { environment } from "../../environments/environment";
const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private chaptersData: Chapter[] = []

  constructor(private http: HttpClient) { }

  getChaptersData() {
    if (this.chaptersData) {
      this.getChapters()
    }
    return this.chaptersData
  }

  getChapters() {
    return this.http.get(url + "chapters").pipe(
      map((data: any) => <Chapter[]>data),
      tap(data => this.chaptersData = data),
      shareReplay(1),
      catchError(this.handleError)
    );
  }


  getChaptersBySubjectId(subjectId: string) {
    return this.http.get(url + "chapters/bysubjectid/" + subjectId).pipe(
      map((data: any) => <Chapter[]>data),
      tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }


}
