import { TestBed } from '@angular/core/testing';

import { ProgressOverlayService } from './progress-overlay.service';

describe('ProgressOverlayService', () => {
  let service: ProgressOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
