import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmailSendComponent } from './gmail-send.component';

describe('GmailSendComponent', () => {
  let component: GmailSendComponent;
  let fixture: ComponentFixture<GmailSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GmailSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmailSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
