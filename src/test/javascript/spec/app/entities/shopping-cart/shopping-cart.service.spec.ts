/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ShoppingCartService } from 'app/entities/shopping-cart/shopping-cart.service';
import { IShoppingCart, ShoppingCart, OrderStatus, PaymentMethod } from 'app/shared/model/shopping-cart.model';

describe('Service Tests', () => {
  describe('ShoppingCart Service', () => {
    let injector: TestBed;
    let service: ShoppingCartService;
    let httpMock: HttpTestingController;
    let elemDefault: IShoppingCart;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ShoppingCartService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ShoppingCart(0, currentDate, OrderStatus.COMPLETED, 0, PaymentMethod.CREDIT_CARD, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            placedDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a ShoppingCart', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            placedDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            placedDate: currentDate
          },
          returnedFromService
        );
        service
          .create(new ShoppingCart(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a ShoppingCart', async () => {
        const returnedFromService = Object.assign(
          {
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            totalPrice: 1,
            paymentMethod: 'BBBBBB',
            paymentReference: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            placedDate: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of ShoppingCart', async () => {
        const returnedFromService = Object.assign(
          {
            placedDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            totalPrice: 1,
            paymentMethod: 'BBBBBB',
            paymentReference: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            placedDate: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ShoppingCart', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
