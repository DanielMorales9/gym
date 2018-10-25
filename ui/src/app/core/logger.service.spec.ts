import {TestBed, inject, ComponentFixture} from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
    let service: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggerService],
        });
        service = new LoggerService("hello world");
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
