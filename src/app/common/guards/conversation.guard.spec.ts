import { TestBed } from '@angular/core/testing';

import { ConversationGuard } from './conversation.guard';

describe('ConversationGuard', () => {
  let guard: ConversationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConversationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
