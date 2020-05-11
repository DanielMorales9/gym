import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SalesService} from './sales.service';

describe('SalesService', () => {

    let salesService: SalesService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [SalesService]
        });

        // Inject the http service and test controller for each test
        salesService = TestBed.get(SalesService);
        backend = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('testing #get', done => {
        salesService.get(1, 5).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/sales?page=1&size=5&sort=createdAt,desc',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #deleteBundleSpecs', done => {
        const query = 'query';
        salesService.delete(1)
            .subscribe(res => {
                expect(res).toEqual({});
                done();
            });
        const req = backend.expectOne({
            url: '/sales/1',
            method: 'DELETE'
        });
        req.flush({});
    });

    it('testing #pay', done => {
        salesService.pay(1, 5).subscribe(res => {
            expect(res).toEqual({});
            done();
        });
        const req = backend.expectOne({
            url: '/sales/1/pay?amount=5',
            method: 'GET'
        });
        req.flush({});
    });

    it('testing #confirmSale', done => {
        salesService.confirmSale(1)
            .subscribe(res => {
                expect(res).toEqual([]);
                done();
            });
        const req = backend.expectOne({
            url: '/sales/1/confirm',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #findById', done => {
        salesService.findById(1)
            .subscribe(res => {
                expect(res).toEqual([]);
                done();
            });
        const req = backend.expectOne({
            url: '/sales/1',
            method: 'GET'
        });
        req.flush([]);
    });

});
