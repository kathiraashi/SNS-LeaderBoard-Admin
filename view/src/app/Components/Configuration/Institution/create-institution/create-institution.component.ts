import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DeleteConfirmationComponent } from '../../../Common-Components/delete-confirmation/delete-confirmation.component';
import { CreateDepartmentModelComponent } from '../../../../models/Institution/create-department-model/create-department-model.component';
import { CreateCourseModelComponent } from '../../../../models/Institution/create-course-model/create-course-model.component';
import { CreateExtraCurricularActivitiesModelComponent } from '../../../../models/Institution/create-extra-curricular-activities-model/create-extra-curricular-activities-model.component';
import { CreateStaffsModelComponent } from '../../../../models/Institution/create-staffs-model/create-staffs-model.component';


@Component({
  selector: 'app-create-institution',
  templateUrl: './create-institution.component.html',
  styleUrls: ['./create-institution.component.css']
})
export class CreateInstitutionComponent implements OnInit {
   Active_Tab = 'Courses';

   bsModalRef: BsModalRef;

   constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  Active_Tab_Change(name) {
   this.Active_Tab = name;
}
  CreateDepartment() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateDepartmentModelComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewDepartment() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateDepartmentModelComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteDepartment() {
   const initialState = {
      Text: 'Department'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
CreateCourse() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateCourseModelComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewCourse() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateCourseModelComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteCourse() {
   const initialState = {
      Text: 'Course'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
CreateExtraCurricularActivities() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateExtraCurricularActivitiesModelComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewExtraCurricularActivities() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateExtraCurricularActivitiesModelComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteExtraCurricularActivities() {
   const initialState = {
      Text: 'ExtraCurricularActivities'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
CreateStaffs() {
   const initialState = {
     Type: 'Create'
   };
   this.bsModalRef = this.modalService.show(CreateStaffsModelComponent, Object.assign({initialState}, { class: 'modal-lg' }));
 }
 ViewStaffs() {
   const initialState = {
     Type: 'View'
   };
   this.bsModalRef = this.modalService.show(CreateStaffsModelComponent, Object.assign({initialState}, { class: '' }));
 }
 DeleteStaffs() {
   const initialState = {
      Text: 'Staffs'
   };
   this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}


}
