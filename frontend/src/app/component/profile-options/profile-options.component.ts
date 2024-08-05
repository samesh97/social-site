import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  logout = () => 
  {
    this.logoutEmitter.emit(true);
  }
  viewUserProfile = () =>
  {
    this.viewUserProfileEmitter.emit(true);
  }
}
