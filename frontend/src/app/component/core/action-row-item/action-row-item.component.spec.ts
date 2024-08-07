import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestItemComponent } from './action-row-item.component';

describe('FriendRequestItemComponent', () => {
  let component: FriendRequestItemComponent;
  let fixture: ComponentFixture<FriendRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendRequestItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
