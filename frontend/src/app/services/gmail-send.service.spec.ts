import { TestBed } from '@angular/core/testing';

import { GmailSendService } from './gmail-send.service';

describe('GmailSendService', () => {
  let service: GmailSendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmailSendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
