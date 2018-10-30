import {TestBed} from "@angular/core/testing";
import {UserService} from "./users.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../model/user.class";
import {BundlesService} from "./bundles.service";
import {Bundle} from "../model/bundle.class";
import {query} from "@angular/animations";

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

    it("testing #get", done => {
        bundleService.get(1, 5).subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        let req = backend.expectOne({
            url: "/bundleSpecs?page=1&size=5&sort=name",
            method: "GET"
        });
        req.flush([]);
    });

    it("testing #postBundle", done => {
        let bundle = new Bundle();
        bundleService.post(bundle).subscribe(res => {
            let expected = new Bundle();
            expected.id = 1;
            expect(res).toEqual(expected);
            done();
        });
        let req = backend.expectOne({
            url: "/bundleSpecs",
            method: "POST"
        });
        let actual = new Bundle();
        actual.id = 1;
        req.flush(actual);
    });

    it("testing #put", done => {
        let bundle = new Bundle();
        bundle.id = 1;
        bundleService.put(bundle).subscribe(res => {
            let expected = new Bundle();
            expected.id = 1;
            expected.description = "now";
            expect(res).toEqual(expected);
            done();
        });
        let req = backend.expectOne({
            url: "/bundleSpecs/1",
            method: "PUT"
        });
        bundle.description = "now";
        req.flush(bundle);
    });

    it("testing #searchNotDisabled", done => {
        let query="query";
        bundleService.searchNotDisabled(query, 1, 5)
            .subscribe(res => {
                expect(res).toEqual([]);
                done();
            });
        let url = "/bundleSpecs/searchNotDisabled?query=query&page=1&size=5&sort=createdAt,desc&sort=name,asc";
        let req = backend.expectOne({
            url: url,
            method: "GET"
        });
        req.flush([]);
    });

    it("testing #search", done => {
        let bundle = new Bundle();
        bundle.id = 1;
        bundle.description = "now";
        bundleService.search("query",1, 5).subscribe(res => {
            expect(res).toEqual([bundle]);
            done();
        });
        let req = backend.expectOne({
            url: "/bundleSpecs/search?query=query&page=1&size=5&sort=createdAt,desc&sort=name,asc",
            method: "GET"
        });
        req.flush([bundle]);
    });

    it("testing #getNotDisabled", done => {
        let bundle = new Bundle();
        bundle.id = 1;
        bundle.description = "now";
        bundleService.getNotDisabled(1, 5).subscribe(res => {
            expect(res).toEqual([bundle]);
            done();
        });
        let req = backend.expectOne({
            url: "/bundleSpecs/getNotDisabled?page=1&size=5&sort=createdAt,desc&sort=name,asc",
            method: "GET"
        });
        req.flush([bundle]);
    });

    it("testing #getSessions", done => {
        bundleService.getSessions("endpoint").subscribe(res => {
            expect(res).toEqual([]);
            done();
        });
        let req = backend.expectOne({
            url: "endpoint",
            method: "GET"
        });
        req.flush([]);
    });
    
});