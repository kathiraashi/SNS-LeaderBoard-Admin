import { Component, OnInit } from '@angular/core';


import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-create-department-model',
  templateUrl: './create-department-model.component.html',
  styleUrls: ['./create-department-model.component.css']
})
export class CreateDepartmentModelComponent implements OnInit {

   Type: string;
   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }



}
