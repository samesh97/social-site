import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/configuration/common.conf';
import { Response } from 'src/app/model/response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private SEARCH_URL = `${config.SERVER_BASE_URL}/users/search`;
  constructor(private http: HttpClient) { }

  search = (keyword: string): Observable<Response> =>
  {
    return this.http.get<Response>(`${this.SEARCH_URL}?keyword=${keyword}`, { withCredentials: true });
  }
}