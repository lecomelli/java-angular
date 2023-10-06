import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerDetails } from 'app/shared/model/customer-details.model';

@Component({
  selector: 'jhi-customer-details-detail',
  templateUrl: './customer-details-detail.component.html'
})
export class CustomerDetailsDetailComponent implements OnInit {
  customerDetails: ICustomerDetails;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ customerDetails }) => {
      this.customerDetails = customerDetails;
    });
  }

  previousState() {
    window.history.back();
  }
}
