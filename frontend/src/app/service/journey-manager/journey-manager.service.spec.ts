import { TestBed } from '@angular/core/testing';

import { JourneyManagerService } from './journey-manager.service';

describe('JourneyManagerService', () => {
  let service: JourneyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JourneyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
