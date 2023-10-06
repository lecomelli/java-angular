import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShoppingCart, ShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';
import { ICustomerDetails } from 'app/shared/model/customer-details.model';
import { CustomerDetailsService } from 'app/entities/customer-details';

@Component({
  selector: 'jhi-shopping-cart-update',
  templateUrl: './shopping-cart-update.component.html'
})
export class ShoppingCartUpdateComponent implements OnInit {
  shoppingCart: IShoppingCart;
  isSaving: boolean;

  customerdetails: ICustomerDetails[];

  editForm = this.fb.group({
    id: [],
    placedDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    totalPrice: [null, [Validators.required, Validators.min(0)]],
    paymentMethod: [null, [Validators.required]],
    paymentReference: [],
    customerDetails: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected shoppingCartService: ShoppingCartService,
    protected customerDetailsService: CustomerDetailsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ shoppingCart }) => {
      this.updateForm(shoppingCart);
      this.shoppingCart = shoppingCart;
    });
    this.customerDetailsService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICustomerDetails[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICustomerDetails[]>) => response.body)
      )
      .subscribe((res: ICustomerDetails[]) => (this.customerdetails = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(shoppingCart: IShoppingCart) {
    this.editForm.patchValue({
      id: shoppingCart.id,
      placedDate: shoppingCart.placedDate != null ? shoppingCart.placedDate.format(DATE_TIME_FORMAT) : null,
      status: shoppingCart.status,
      totalPrice: shoppingCart.totalPrice,
      paymentMethod: shoppingCart.paymentMethod,
      paymentReference: shoppingCart.paymentReference,
      customerDetails: shoppingCart.customerDetails
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const shoppingCart = this.createFromForm();
    if (shoppingCart.id !== undefined) {
      this.subscribeToSaveResponse(this.shoppingCartService.update(shoppingCart));
    } else {
      this.subscribeToSaveResponse(this.shoppingCartService.create(shoppingCart));
    }
  }

  private createFromForm(): IShoppingCart {
    const entity = {
      ...new ShoppingCart(),
      id: this.editForm.get(['id']).value,
      placedDate:
        this.editForm.get(['placedDate']).value != null ? moment(this.editForm.get(['placedDate']).value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status']).value,
      totalPrice: this.editForm.get(['totalPrice']).value,
      paymentMethod: this.editForm.get(['paymentMethod']).value,
      paymentReference: this.editForm.get(['paymentReference']).value,
      customerDetails: this.editForm.get(['customerDetails']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingCart>>) {
    result.subscribe((res: HttpResponse<IShoppingCart>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackCustomerDetailsById(index: number, item: ICustomerDetails) {
    return item.id;
  }
}
