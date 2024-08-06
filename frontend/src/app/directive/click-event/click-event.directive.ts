import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, TemplateRef } from '@angular/core';
import { ClickEventService } from '../../service/click-event/click-event.service';

@Directive({
  selector: '[appClickEvent]'
})
export class ClickEventDirective
{ 
  @Input() currentState: boolean = false;
  @Output() changeListner: EventEmitter<boolean> = new EventEmitter();

  constructor
    (
    private elementRef: ElementRef,
    private clickEventService: ClickEventService
  )
  { 
    this.clickEventService.getClickEvent().subscribe((event: Event) =>
    {
      if (event.target == elementRef.nativeElement)
      {
        this.changeListner.emit(!this.currentState);
      }
      else
      {
        this.changeListner.emit(false);
      }
    });
  }
}
