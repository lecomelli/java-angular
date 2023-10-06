import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICustomerDetails } from 'app/shared/model/customer-details.model';
import { CustomerDetailsService } from './customer-details.service';

@Component({
  selector: 'jhi-customer-details-delete-dialog',
  templateUrl: './customer-details-delete-dialog.component.html'
})
export class CustomerDetailsDeleteDialogComponent {
  customerDetails: ICustomerDetails;

  constructor(
    protected customerDetailsService: CustomerDetailsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.customerDetailsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'customerDetailsListModification',
        content: 'Deleted an customerDetails'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-customer-details-delete-popup',
  template: ''
})
export class CustomerDetailsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ customerDetails }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CustomerDetailsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.customerDetails = customerDetails;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/customer-details', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/customer-details', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
