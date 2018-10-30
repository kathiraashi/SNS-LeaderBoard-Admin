import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

   _Institution: any[] =  [ 'Jay Shri Ram', 'Angel Group Of Institutions' ];
   _Department: any[] =  [ 'Computer Science', 'Electrical And Electronics', 'Mechanical' ];
   _Course: any[] =  [ 'B.E', 'M.E' ];
   _Tutor: any[] = [ 'Tutor 1', 'Tutor 2', 'Tutor 3' ];



   SelectedMethod;
   Form: FormGroup;


  constructor() { }

  ngOnInit() {
  }

}
