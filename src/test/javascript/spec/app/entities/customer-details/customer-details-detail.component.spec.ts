/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StoreTestModule } from '../../../test.module';
import { CustomerDetailsDetailComponent } from 'app/entities/customer-details/customer-details-detail.component';
import { CustomerDetails } from 'app/shared/model/customer-details.model';

describe('Component Tests', () => {
  describe('CustomerDetails Management Detail Component', () => {
    let comp: CustomerDetailsDetailComponent;
    let fixture: ComponentFixture<CustomerDetailsDetailComponent>;
    const route = ({ data: of({ customerDetails: new CustomerDetails(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StoreTestModule],
        declarations: [CustomerDetailsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CustomerDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CustomerDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.customerDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
