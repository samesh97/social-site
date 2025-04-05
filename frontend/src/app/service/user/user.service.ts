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
  private FRIEND_URL = `${config.SERVER_BASE_URL}/friends`;
  private SUGGESTION_URL = `${config.SERVER_BASE_URL}/suggestions`;
  constructor(private http: HttpClient) { }

  search = (keyword: string): Observable<Response> =>
  {
    return this.http.get<Response>(`${this.SEARCH_URL}?keyword=${keyword}`);
  }
  viewProfile = (id: string) =>
  {
    return this.http.get<Response>(`${this.PROFILE_URL}/${id}`);
  }
  register = (formData: FormData): Observable<Response> =>
  {
    return this.http.post<Response>(this.PROFILE_URL, formData);
  }
  addFriend = (userId: string) =>
  {
    return this.http.post<Response>(this.FRIEND_URL, { userId: userId });
  }
  getFriendRequests = () =>
  {
    return this.http.get<Response>(`${this.FRIEND_URL}/requests`);
  }
  acceptOrDenyFriendRequest = (userId: string, isAccepted: boolean) =>
  {
    return this.http.post<Response>(`${this.FRIEND_URL}/action`, { userId: userId, accepted: isAccepted });
  }
  getSuggestions = () => {
    return this.http.get<Response>(this.SUGGESTION_URL);
  }
}
