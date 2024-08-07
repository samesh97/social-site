import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css']
})
export class CardItemComponent
{
  @Input() id: string = '';
  @Input() image: string = '';
  @Input() intialActionText: string = '';
  @Input() textAfterActionPerformed: string = '';
  @Input() contents: string[] = [];

  @Output() mainButtonClickListener = new EventEmitter<string>();

  actionPeformed: boolean = false;

  btnClicked = () =>
  {
    this.actionPeformed = true;  
    this.intialActionText = this.textAfterActionPerformed;
    this.mainButtonClickListener.emit(this.id);
  }
}
