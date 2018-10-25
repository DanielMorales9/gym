import { ProfileRouting } from './profile.routing';

describe('ProfileRouting', () => {
  let profileRoutingModule: ProfileRouting;

  beforeEach(() => {
    profileRoutingModule = new ProfileRouting();
  });

  it('should create an instance', () => {
    expect(profileRoutingModule).toBeTruthy();
  });
});
