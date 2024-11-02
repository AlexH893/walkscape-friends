import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RegionsService {
  constructor(private http: HttpClient) {}

  //  Get JSON Data from file
  public getRegions(): Observable<any> {
    return this.http.get('../assets/countries.json');
  }
}
