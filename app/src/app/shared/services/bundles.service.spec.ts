import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BundlesService} from './bundles.service';
import {PersonalBundleSpecification} from '../model';

describe('BundlesService', () => {

    let bundleService: BundlesService;
    let backend: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [BundlesService]
        });

        // Inject the http service and test controller for each test
        bundleService = TestBed.get(BundlesService);
        backend = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        backend.verify();
    });

    it('testing #get', done => {
        bundleService.get(1, 5).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: '/bundleSpecs?page=1&size=5&sort=name',
            method: 'GET'
        });
        req.flush([]);
    });

    it('testing #postBundle', done => {
        const bundle = new PersonalBundleSpecification();
        bundleService.post(bundle).subscribe(res => {
            const expected = new PersonalBundleSpecification();
            expected.id = 1;
            expect(res).toEqual(expected);
            done();
        });
        const req = backend.expectOne({
            url: '/bundleSpecs',
            method: 'POST'
        });
        const actual = new PersonalBundleSpecification();
        actual.id = 1;
        req.flush(actual);
    });

    it('testing #put', done => {
        const bundle = new PersonalBundleSpecification();
        bundle.id = 1;
        bundleService.patch(bundle).subscribe(res => {
            const expected = new PersonalBundleSpecification();
            expected.id = 1;
            expected.description = 'now';
            expect(res).toEqual(expected);
            done();
        });
        const req = backend.expectOne({
            url: '/bundleSpecs/1',
            method: 'PATCH'
        });
        bundle.description = 'now';
        req.flush(bundle);
    });

    it('testing #search', done => {
        const bundle = new PersonalBundleSpecification();
        bundle.id = 1;
        bundle.description = 'now';
        bundleService.search('query', 1, 5).subscribe(res => {
            expect(res).toEqual([bundle]);
            done();
        });
        const req = backend.expectOne({
            url: '/bundleSpecs/search?query=query&page=1&size=5&sort=createdAt,desc&sort=name,asc',
            method: 'GET'
        });
        req.flush([bundle]);
    });

    it('testing #getSessions', done => {
        bundleService.getSessions('endpoint').subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        const req = backend.expectOne({
            url: 'endpoint',
            method: 'GET'
        });
        req.flush([]);
    });

});
