import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}
 
  private formatErrors(error: any) {
    return throwError(() => error.error || error);
  }
 
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(this.baseUrl + path, { params }).pipe(
      map((res) => res),
      catchError(this.formatErrors)
    );
  }
 
  post(path: string, body: any): Observable<any> {
    return this.http.post(this.baseUrl + path, body).pipe(
      map((res) => res),
      catchError(this.formatErrors)
    );
  }
 
  put(path: string, body: any): Observable<any> {
    return this.http.put(this.baseUrl + path, body).pipe(
      map((res) => res),
      catchError(this.formatErrors)
    );
  }
 
  delete(path: string): Observable<any> {
    return this.http.delete(this.baseUrl + path).pipe(
      map((res) => res),
      catchError(this.formatErrors)
    );
  }
}