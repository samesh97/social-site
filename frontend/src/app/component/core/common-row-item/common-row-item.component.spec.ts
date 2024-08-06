import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRowItemComponent } from './common-row-item.component';

describe('CommonRowItemComponent', () => {
  let component: CommonRowItemComponent;
  let fixture: ComponentFixture<CommonRowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonRowItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonRowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
