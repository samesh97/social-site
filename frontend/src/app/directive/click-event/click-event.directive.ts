import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ClickEventService } from '../../service/click-event/click-event.service';

@Directive({
  selector: '[appClickEvent]'
})
export class ClickEventDirective
{ 
  @Input() triggeringSourceIds: string[] = [];
  @Input() currentState: boolean = false;
  @Output() changeListner: EventEmitter<boolean> = new EventEmitter();

  constructor
    (
    private elementRef: ElementRef,
    private clickEventService: ClickEventService
  )
  { 

    document.addEventListener('click', (event: Event) =>
    {
      if ( this.isTrggeringSource( event ) || this.isSameElement(event, elementRef) || this.isChild(event.target as HTMLElement, elementRef))
      {
          this.changeListner.emit(true);  
      }
      else
      {
          this.changeListner.emit(false);  
      }
    });

  }
  private isTrggeringSource = (event: any) =>
  {
    return this.triggeringSourceIds.some( item => item == event.target['id'] ) ? !this.currentState : false;
  }
  private isSameElement = (clickElement: Event, currentElement: ElementRef) =>
  {
      return clickElement.target == currentElement.nativeElement;
  }

  private isChild = (htmlElement: HTMLElement, currentElement: ElementRef) =>
  {
    console.log(currentElement.nativeElement.contains( htmlElement ))
      return currentElement.nativeElement.contains( htmlElement );
  }
}
