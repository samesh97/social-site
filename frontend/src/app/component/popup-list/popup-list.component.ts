import { Component, Input } from '@angular/core';

@Component({
  selector: 'popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.css']
})
export class PopupListComponent
{
  @Input() isOpen: boolean = false;

  outFocused = () => {
    this.isOpen = false;
  }
}
