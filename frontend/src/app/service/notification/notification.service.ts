import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/configuration/common.conf';
import { Response } from 'src/app/model/response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private NOTIFICATION_URL = `${config.SERVER_BASE_URL}/notifications`;

  constructor(private http: HttpClient)
  { }

  loadNotifications = () => {
    return this.http.get<Response>(this.NOTIFICATION_URL);
  }
}
