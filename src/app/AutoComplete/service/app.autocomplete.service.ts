import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
  } from '@angular/common/http';
import { City } from '../autocomplete.model';

  @Injectable({
    providedIn: 'root',
  })

  export class AutoCompleteService{
    basicUrl: string = "https://localhost:44351/api/city";
    constructor(private http: HttpClient){

    }
    getCities(search: string): Observable<City[]> {
        return this.http.get<City[]>(`${this.basicUrl}/${search}`);
    }

  }
