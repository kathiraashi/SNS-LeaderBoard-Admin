import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-level',
  templateUrl: './create-level.component.html',
  styleUrls: ['./create-level.component.css']
})
export class CreateLevelComponent implements OnInit {

   _Institution: any[] =  ['Jay Shri Ram', 'Angel Group Of Institutions'];
   _Activities: any[] =  ['Activity-1', 'Activity-2', 'Activity-3'];

   SelectedMethod;
   Form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
