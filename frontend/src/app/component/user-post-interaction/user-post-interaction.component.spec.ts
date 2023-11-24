import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostInteractionComponent } from './user-post-interaction.component';

describe('UserPostInteractionComponent', () => {
  let component: UserPostInteractionComponent;
  let fixture: ComponentFixture<UserPostInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPostInteractionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPostInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
