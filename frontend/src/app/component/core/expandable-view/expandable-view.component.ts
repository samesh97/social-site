import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpandableRow } from 'src/app/model/expandable-row.model';

@Component({
  selector: 'app-expandable-view',
  templateUrl: './expandable-view.component.html',
  styleUrls: ['./expandable-view.component.css']
})
export class ExpandableViewComponent
{
  @Input() showSize: number = 10;
  @Input() list: ExpandableRow[] = [];
  @Output() itemClickListener: EventEmitter<string> = new EventEmitter();
  showingList: ExpandableRow[] = [];

  getShowingList = (): ExpandableRow[] =>
  {
    this.showingList = this.list.slice(0, this.showSize);
    return this.showingList;
  }
  itemClickListenerEvent = (id: string) =>
  {
    this.itemClickListener.emit(id);
  }
}
