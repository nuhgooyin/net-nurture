import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GmailFetchDialogComponent } from './gmail-fetch-dialog.component';

describe('GmailFetchDialogComponent', () => {
  let component: GmailFetchDialogComponent;
  let fixture: ComponentFixture<GmailFetchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GmailFetchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GmailFetchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
