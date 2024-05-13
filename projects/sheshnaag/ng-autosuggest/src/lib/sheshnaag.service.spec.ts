import { TestBed } from '@angular/core/testing';

import { SheshnaagService } from './sheshnaag.service';

describe('SheshnaagService', () => {
  let service: SheshnaagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheshnaagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
