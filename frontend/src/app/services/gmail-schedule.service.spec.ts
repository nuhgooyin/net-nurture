import { TestBed } from '@angular/core/testing';

import { GmailScheduleService } from './gmail-schedule.service';

describe('GmailScheduleService', () => {
  let service: GmailScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmailScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
