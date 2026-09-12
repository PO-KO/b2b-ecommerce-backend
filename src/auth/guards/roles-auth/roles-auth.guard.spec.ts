import { RolesAuthGuard } from './roles-auth.guard.js';

describe('RolesAuthGuard', () => {
  it('should be defined', () => {
    expect(new RolesAuthGuard()).toBeDefined();
  });
});
