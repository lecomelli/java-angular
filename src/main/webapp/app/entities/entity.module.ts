import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        loadChildren: './product/product.module#StoreProductModule'
      },
      {
        path: 'product-category',
        loadChildren: './product-category/product-category.module#StoreProductCategoryModule'
      },
      {
        path: 'customer-details',
        loadChildren: './customer-details/customer-details.module#StoreCustomerDetailsModule'
      },
      {
        path: 'shopping-cart',
        loadChildren: './shopping-cart/shopping-cart.module#StoreShoppingCartModule'
      },
      {
        path: 'product-order',
        loadChildren: './product-order/product-order.module#StoreProductOrderModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreEntityModule {}
