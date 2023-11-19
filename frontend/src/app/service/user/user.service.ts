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
  private PROFILE_URL = `${config.SERVER_BASE_URL}/users`;
  constructor(private http: HttpClient) { }

  search = (keyword: string): Observable<Response> =>
  {
    return this.http.get<Response>(`${this.SEARCH_URL}?keyword=${keyword}`, { withCredentials: true });
  }
  viewProfile = (id: string) => 
  {
    return this.http.get<Response>(`${this.PROFILE_URL}/${id}`, { withCredentials: true });
  }
  register = (formData: FormData): Observable<Response> => 
  {
    return this.http.post<Response>(this.PROFILE_URL, formData, { withCredentials: true });
  }
}
