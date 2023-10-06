import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductOrder, ProductOrder } from 'app/shared/model/product-order.model';
import { ProductOrderService } from './product-order.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from 'app/entities/shopping-cart';

@Component({
  selector: 'jhi-product-order-update',
  templateUrl: './product-order-update.component.html'
})
export class ProductOrderUpdateComponent implements OnInit {
  productOrder: IProductOrder;
  isSaving: boolean;

  products: IProduct[];

  shoppingcarts: IShoppingCart[];

  editForm = this.fb.group({
    id: [],
    quantity: [null, [Validators.required, Validators.min(0)]],
    totalPrice: [null, [Validators.required, Validators.min(0)]],
    product: [null, Validators.required],
    cart: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productOrderService: ProductOrderService,
    protected productService: ProductService,
    protected shoppingCartService: ShoppingCartService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productOrder }) => {
      this.updateForm(productOrder);
      this.productOrder = productOrder;
    });
    this.productService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduct[]>) => response.body)
      )
      .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.shoppingCartService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IShoppingCart[]>) => mayBeOk.ok),
        map((response: HttpResponse<IShoppingCart[]>) => response.body)
      )
      .subscribe((res: IShoppingCart[]) => (this.shoppingcarts = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(productOrder: IProductOrder) {
    this.editForm.patchValue({
      id: productOrder.id,
      quantity: productOrder.quantity,
      totalPrice: productOrder.totalPrice,
      product: productOrder.product,
      cart: productOrder.cart
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productOrder = this.createFromForm();
    if (productOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.productOrderService.update(productOrder));
    } else {
      this.subscribeToSaveResponse(this.productOrderService.create(productOrder));
    }
  }

  private createFromForm(): IProductOrder {
    const entity = {
      ...new ProductOrder(),
      id: this.editForm.get(['id']).value,
      quantity: this.editForm.get(['quantity']).value,
      totalPrice: this.editForm.get(['totalPrice']).value,
      product: this.editForm.get(['product']).value,
      cart: this.editForm.get(['cart']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrder>>) {
    result.subscribe((res: HttpResponse<IProductOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackShoppingCartById(index: number, item: IShoppingCart) {
    return item.id;
  }
}
