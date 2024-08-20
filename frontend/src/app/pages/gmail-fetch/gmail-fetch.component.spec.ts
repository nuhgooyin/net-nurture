import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmailFetchComponent } from './gmail-fetch.component';

describe('GmailFetchComponent', () => {
  let component: GmailFetchComponent;
  let fixture: ComponentFixture<GmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GmailFetchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
