import { TestBed, inject } from '@angular/core/testing';

import { HttpService } from './http.service';
import {HttpHandler, HttpHeaders} from "@angular/common/http";
import {ApiPrefixInterceptor} from "./api-prefix.interceptor";
import {ErrorHandlerInterceptor} from "./error-handler.interceptor";

describe('HttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpService, HttpHandler, ApiPrefixInterceptor, ErrorHandlerInterceptor]
    });
  });

  it('should be created', inject([HttpService], (service: HttpService) => {
    expect(service).toBeTruthy();
  }));
});
