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

    it('testing #findUserSales', done => {
        salesService.findUserSales({id: 1}, 1, 5).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/sales/findUserSales?id=1&page=1&size=5&sort=createdAt,desc',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #createSale', async done => {
        const promise = salesService.createSale(1);
        const req = backend.expectOne({
            url: '/sales/createSale/1',
            method: 'GET'
        });
        req.flush({});
        const [res, error] = await promise;
        expect(res).toEqual({});
        done();
    });

    it('testing #delete', done => {
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
            url: '/sales/pay/1?amount=5',
            method: 'GET'
        });
        req.flush({});
    });

    it('testing #getEndpoint', done => {
        const endpoint = 'endpoint';
        salesService.getEndpoint(endpoint).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: endpoint,
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #searchByLastName', done => {
        salesService.searchByLastName({lastName: 'prova'}, 1, 5).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/sales/searchByLastName?lastName=prova&page=1&size=5&sort=createdAt,desc',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #searchByDateAndId', done => {
        salesService.searchByDateAndId({id:1, date: 'query'}, 1, 5)
            .subscribe(res => {
                expect(res).toEqual([]);
                done();
            });
        const req = backend.expectOne({
            url: '/sales/searchByDateAndId?id=1&date=query&page=1&size=5&sort=createdAt,asc',
            method: 'GET'
        });
        req.flush([]);
    });

    // it('testing #addSalesLineItem', done => {
    //     salesService.addSalesLineItem({saleId: 1, bundleSpecId: 1})
    //         .subscribe(res => {
    //             expect(res).toEqual([]);
    //             done();
    //         });
    //     const req = backend.expectOne({
    //         url: '/sales/addSalesLineItem',
    //         method: 'GET'
    //     });
    //     req.flush([]);
    // });

    it('testing #confirmSale', done => {
        salesService.confirmSale(1)
            .subscribe(res => {
                expect(res).toEqual([]);
                done();
            });
        const req = backend.expectOne({
            url: '/sales/confirmSale/1',
            method: 'GET'
        });
        req.flush([]);
    });

    // it('testing #deleteSalesLineItem', done => {
    //     salesService.deleteSalesLineItem(1, 1)
    //         .subscribe(res => {
    //             expect(res).toEqual([]);
    //             done();
    //         });
    //     const req = backend.expectOne({
    //         url: '/sales/deleteSalesLineItem/1/1',
    //         method: 'DELETE'
    //     });
    //     req.flush([]);
    // });

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
