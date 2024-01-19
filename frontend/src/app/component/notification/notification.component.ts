import { Component, Input } from '@angular/core';
import { Notification } from 'src/app/model/notification.model';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent
{
  @Input() isOpen: boolean = false;
  @Input() notifications: Notification[] = [];


  getType = (type: string) =>
  {
    if (type == "LIKE")
    {
      return "liked";  
    }
    if (type == "Comment")
    {
      return "commented on";  
    }
    return "";
  }
}
