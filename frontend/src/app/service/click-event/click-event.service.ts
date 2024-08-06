import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickEventService
{
  private clickSubject: ReplaySubject<Event> = new ReplaySubject(1);
  constructor() { }

  getClickEvent() : ReplaySubject<Event>
  {
    return this.clickSubject;
  }
}
