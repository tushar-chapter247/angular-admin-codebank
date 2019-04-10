import { Injectable } from '@angular/core';
import { CoreAppSettings } from '../../core.settings';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private API: string = CoreAppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) {}

  // GET TOTAL USERS COUNT
  getUserscount(body, accessToken?: string): Observable<any> {
    const url =
      this.API +
      `UserAccounts/count?where=${JSON.stringify(
        body
      )}&access_token=${accessToken}`;
    return this.http.get(url);
  }

  // GET ALL USERS FROM SERVER
  fetchUsers(body, accessToken?: string): Observable<any> {
    const url =
      this.API +
      `UserAccounts?filter=${JSON.stringify(body)}&access_token=${accessToken}`;
    return this.http.get(url);
  }
}
