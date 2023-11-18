import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent {
  @Input() users: User[] = [];

  @Output() select: EventEmitter<string> = new EventEmitter();

  selected = (id: string) => 
  {
    this.users = [];
    this.select.emit(id);
  }
}
