import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmailScheduleComponent } from './gmail-schedule.component';

describe('GmailScheduleComponent', () => {
  let component: GmailScheduleComponent;
  let fixture: ComponentFixture<GmailScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GmailScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
