import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Username } from '../models/username.interface';

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  private apiUrl = 'http://localhost:3000/api/usernames'; // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch usernames with a typed response
  fetchUsernames(): Observable<Username[]> {
    return this.http.get<Username[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching usernames:', error);
        throw error; // Re-throwing the error for further handling if needed
      })
    );
  }

  // Create a username
  createUsername(username: string): Observable<Username> {
    // Use a specific type for response
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<Username>(this.apiUrl, { username }, { headers })
      .pipe(
        // Adjusted property name
        catchError((error) => {
          console.error('Error creating username:', error);
          throw error; // Re-throwing the error
        })
      );
  }
}
