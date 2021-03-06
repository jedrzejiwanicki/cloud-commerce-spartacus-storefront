import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalMessageService, ServerConfig } from '@spartacus/core';
import { HttpResponseStatus } from '../models/response-status.model';
import {
  BadGatewayHandler,
  BadRequestHandler,
  ConflictHandler,
  ForbiddenHandler,
  GatewayTimeoutHandler,
  HttpErrorHandler,
  NotFoundHandler,
  UnknownErrorHandler,
} from './handlers';
import { HttpErrorInterceptor } from './http-error.interceptor';
import createSpy = jasmine.createSpy;

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let mockMessageService: any;
  let http: HttpClient;
  const MockServerConfig: ServerConfig = { production: false };

  beforeEach(() => {
    mockMessageService = {
      add: createSpy(),
      remove: createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useClass: HttpErrorHandler,
          multi: true,
        },
        BadGatewayHandler,
        BadRequestHandler,
        ConflictHandler,
        ForbiddenHandler,
        GatewayTimeoutHandler,
        NotFoundHandler,
        UnknownErrorHandler,
        {
          provide: HttpErrorHandler,
          useExisting: UnknownErrorHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: BadGatewayHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: BadRequestHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: ConflictHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: ForbiddenHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: GatewayTimeoutHandler,
          multi: true,
        },
        {
          provide: HttpErrorHandler,
          useExisting: NotFoundHandler,
          multi: true,
        },
        { provide: GlobalMessageService, useValue: mockMessageService },
        { provide: ServerConfig, useValue: MockServerConfig },
      ],
    });

    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  });

  describe('Error Handlers', () => {
    function testHandlers(handlerClass, responseStatus) {
      it('should call handleError for ' + handlerClass.name, function() {
        http
          .get('/123')
          .pipe(catchError((error: any) => throwError(error)))
          .subscribe(_result => {}, error => (this.error = error));
        const mockReq = httpMock.expectOne(req => {
          return req.method === 'GET';
        });

        const handler = TestBed.get(handlerClass);

        spyOn(handler, 'handleError');
        mockReq.flush({}, { status: responseStatus, statusText: '' });

        expect(handler.handleError).toHaveBeenCalled();
      });
    }

    testHandlers(UnknownErrorHandler, HttpResponseStatus.UNKNOWN);
    testHandlers(BadGatewayHandler, HttpResponseStatus.BAD_GATEWAY);
    testHandlers(BadRequestHandler, HttpResponseStatus.BAD_REQUEST);
    testHandlers(ConflictHandler, HttpResponseStatus.CONFLICT);
    testHandlers(ForbiddenHandler, HttpResponseStatus.FORBIDDEN);
    testHandlers(GatewayTimeoutHandler, HttpResponseStatus.GATEWAY_TIMEOUT);
    testHandlers(NotFoundHandler, HttpResponseStatus.NOT_FOUND);

    describe('Unknown response warning for non production env', () => {
      it(`should display proper warning message in the console`, () => {
        spyOn(console, 'warn');
        http
          .get('/unknown')
          .pipe(catchError((error: any) => throwError(error)))
          .subscribe(_result => {}, error => (this.error = error));

        const mockReq = httpMock.expectOne(req => {
          return req.method === 'GET';
        });
        mockReq.flush({}, { status: 123, statusText: 'unknown' });
        expect(console.warn).toHaveBeenCalledWith(
          `Unknown http response error: ${HttpResponseStatus.UNKNOWN}`
        );
      });
    });
  });
});
