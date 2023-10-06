import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CustomerDetails } from 'app/shared/model/customer-details.model';
import { CustomerDetailsService } from './customer-details.service';
import { CustomerDetailsComponent } from './customer-details.component';
import { CustomerDetailsDetailComponent } from './customer-details-detail.component';
import { CustomerDetailsUpdateComponent } from './customer-details-update.component';
import { CustomerDetailsDeletePopupComponent } from './customer-details-delete-dialog.component';
import { ICustomerDetails } from 'app/shared/model/customer-details.model';

@Injectable({ providedIn: 'root' })
export class CustomerDetailsResolve implements Resolve<ICustomerDetails> {
  constructor(private service: CustomerDetailsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICustomerDetails> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CustomerDetails>) => response.ok),
        map((customerDetails: HttpResponse<CustomerDetails>) => customerDetails.body)
      );
    }
    return of(new CustomerDetails());
  }
}

export const customerDetailsRoute: Routes = [
  {
    path: '',
    component: CustomerDetailsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'storeApp.customerDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CustomerDetailsDetailComponent,
    resolve: {
      customerDetails: CustomerDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'storeApp.customerDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CustomerDetailsUpdateComponent,
    resolve: {
      customerDetails: CustomerDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'storeApp.customerDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CustomerDetailsUpdateComponent,
    resolve: {
      customerDetails: CustomerDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'storeApp.customerDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const customerDetailsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CustomerDetailsDeletePopupComponent,
    resolve: {
      customerDetails: CustomerDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'storeApp.customerDetails.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
