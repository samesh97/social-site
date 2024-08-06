import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickEventService } from 'src/app/service/click-event/click-event.service';

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.css']
})
export class ProfileOptionsComponent
{
  @Input() isActive: boolean = false;
  @Output() logoutEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() viewUserProfileEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private clickEventService: ClickEventService)
  {
    this.clickEventService.getClickEvent().subscribe(data =>
    {
      if (this.isActive == true)
      {
        this.isActive = !this.isActive;
      }
    });
  }

  logout = () => 
  {
    this.logoutEmitter.emit(true);
  }
  viewUserProfile = () =>
  {
    this.viewUserProfileEmitter.emit(true);
  }
}
