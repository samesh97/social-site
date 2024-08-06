import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpandableRow } from 'src/app/model/expandable-row.model';

@Component({
  selector: 'app-common-row-item',
  templateUrl: './common-row-item.component.html',
  styleUrls: ['./common-row-item.component.css']
})
export class CommonRowItemComponent
{
  @Input() item: ExpandableRow = new ExpandableRow();
  @Output() mainTextListner: EventEmitter<string> = new EventEmitter();

  mainTextClicked = (id: string) =>
  {
    this.mainTextListner.emit(id);
  }
}
