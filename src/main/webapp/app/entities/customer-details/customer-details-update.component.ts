import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICustomerDetails, CustomerDetails } from 'app/shared/model/customer-details.model';
import { CustomerDetailsService } from './customer-details.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-customer-details-update',
  templateUrl: './customer-details-update.component.html'
})
export class CustomerDetailsUpdateComponent implements OnInit {
  customerDetails: ICustomerDetails;
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    gender: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    addressLine1: [null, [Validators.required]],
    addressLine2: [],
    city: [null, [Validators.required]],
    country: [null, [Validators.required]],
    user: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected customerDetailsService: CustomerDetailsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ customerDetails }) => {
      this.updateForm(customerDetails);
      this.customerDetails = customerDetails;
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(customerDetails: ICustomerDetails) {
    this.editForm.patchValue({
      id: customerDetails.id,
      gender: customerDetails.gender,
      phone: customerDetails.phone,
      addressLine1: customerDetails.addressLine1,
      addressLine2: customerDetails.addressLine2,
      city: customerDetails.city,
      country: customerDetails.country,
      user: customerDetails.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const customerDetails = this.createFromForm();
    if (customerDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.customerDetailsService.update(customerDetails));
    } else {
      this.subscribeToSaveResponse(this.customerDetailsService.create(customerDetails));
    }
  }

  private createFromForm(): ICustomerDetails {
    const entity = {
      ...new CustomerDetails(),
      id: this.editForm.get(['id']).value,
      gender: this.editForm.get(['gender']).value,
      phone: this.editForm.get(['phone']).value,
      addressLine1: this.editForm.get(['addressLine1']).value,
      addressLine2: this.editForm.get(['addressLine2']).value,
      city: this.editForm.get(['city']).value,
      country: this.editForm.get(['country']).value,
      user: this.editForm.get(['user']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerDetails>>) {
    result.subscribe((res: HttpResponse<ICustomerDetails>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
