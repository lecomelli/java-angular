/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { StoreTestModule } from '../../../test.module';
import { CustomerDetailsDeleteDialogComponent } from 'app/entities/customer-details/customer-details-delete-dialog.component';
import { CustomerDetailsService } from 'app/entities/customer-details/customer-details.service';

describe('Component Tests', () => {
  describe('CustomerDetails Management Delete Component', () => {
    let comp: CustomerDetailsDeleteDialogComponent;
    let fixture: ComponentFixture<CustomerDetailsDeleteDialogComponent>;
    let service: CustomerDetailsService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StoreTestModule],
        declarations: [CustomerDetailsDeleteDialogComponent]
      })
        .overrideTemplate(CustomerDetailsDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CustomerDetailsDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CustomerDetailsService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
