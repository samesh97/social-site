import { Component, Input } from '@angular/core';
import { every } from 'rxjs';
import { ExpandableRow } from 'src/app/model/expandable-row.model';
import { Notification } from 'src/app/model/notification.model';
import { ClickEventService } from 'src/app/service/click-event/click-event.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent
{
  @Input() isOpen: boolean = false;
  @Input() notifications: Notification[] = [];

  constructor(
    private clickEventService: ClickEventService
  )
  {
  
    this.clickEventService.getClickEvent().subscribe((data: Event) =>
    {
      // console.log(data.target)
      // if (event != data )
      // {
      //   this.isOpen = false;
      // }
      // else
      // {
      //   this.isOpen = true;  
      // }
    });
  }

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
  getExpandableRowList = ( notifications: Notification[] ): ExpandableRow[] =>
    {
      return notifications.map((notification: Notification) =>
      {
        let expandableRow = new ExpandableRow();
        expandableRow.id = notification.initiatedUser.id;
        expandableRow.date = notification.updatedAt;
        expandableRow.imageUrl = notification.initiatedUser.profileUrl;
        expandableRow.mainText = `${notification.initiatedUser.firstName} ${notification.initiatedUser.lastName}`;
        expandableRow.subText = `${this.getType(notification.type)} your ${notification.targetType.toLowerCase()}.`;
        return expandableRow;
      })
    }
}
