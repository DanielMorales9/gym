import { ErrorRouting } from './error.routing';

describe('ErrorRouting', () => {
  let errorRoutingModule: ErrorRouting;

  beforeEach(() => {
    errorRoutingModule = new ErrorRouting();
  });

  it('should create an instance', () => {
    expect(errorRoutingModule).toBeTruthy();
  });
});
