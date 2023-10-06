import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { StoreSharedModule } from 'app/shared';
import {
  CustomerDetailsComponent,
  CustomerDetailsDetailComponent,
  CustomerDetailsUpdateComponent,
  CustomerDetailsDeletePopupComponent,
  CustomerDetailsDeleteDialogComponent,
  customerDetailsRoute,
  customerDetailsPopupRoute
} from './';

const ENTITY_STATES = [...customerDetailsRoute, ...customerDetailsPopupRoute];

@NgModule({
  imports: [StoreSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CustomerDetailsComponent,
    CustomerDetailsDetailComponent,
    CustomerDetailsUpdateComponent,
    CustomerDetailsDeleteDialogComponent,
    CustomerDetailsDeletePopupComponent
  ],
  entryComponents: [
    CustomerDetailsComponent,
    CustomerDetailsUpdateComponent,
    CustomerDetailsDeleteDialogComponent,
    CustomerDetailsDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreCustomerDetailsModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
