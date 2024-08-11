import { TestBed } from '@angular/core/testing';

import { TimelinePostResolver } from './timeline-post.resolver';

describe('GenericResolverResolver', () => {
  let resolver: TimelinePostResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TimelinePostResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
