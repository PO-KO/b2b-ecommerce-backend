import { CompanyAuthGuard } from './company-auth.guard.js';

describe('CompanyAuthGuard', () => {
  it('should be defined', () => {
    expect(new CompanyAuthGuard()).toBeDefined();
  });
});
