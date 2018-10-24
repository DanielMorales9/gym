import { ErrorRoutingModule } from './error-routing.module';

describe('ErrorRoutingModule', () => {
  let errorRoutingModule: ErrorRoutingModule;

  beforeEach(() => {
    errorRoutingModule = new ErrorRoutingModule();
  });

  it('should create an instance', () => {
    expect(errorRoutingModule).toBeTruthy();
  });
});
