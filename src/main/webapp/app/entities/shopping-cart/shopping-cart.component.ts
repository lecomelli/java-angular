import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { AccountService } from 'app/core';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'jhi-shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCarts: IShoppingCart[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected shoppingCartService: ShoppingCartService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.shoppingCartService
      .query()
      .pipe(
        filter((res: HttpResponse<IShoppingCart[]>) => res.ok),
        map((res: HttpResponse<IShoppingCart[]>) => res.body)
      )
      .subscribe(
        (res: IShoppingCart[]) => {
          this.shoppingCarts = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInShoppingCarts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IShoppingCart) {
    return item.id;
  }

  registerChangeInShoppingCarts() {
    this.eventSubscriber = this.eventManager.subscribe('shoppingCartListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
