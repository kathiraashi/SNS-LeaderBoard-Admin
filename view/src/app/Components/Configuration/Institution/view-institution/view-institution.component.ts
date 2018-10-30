import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-institution',
  templateUrl: './view-institution.component.html',
  styleUrls: ['./view-institution.component.css']
})
export class ViewInstitutionComponent implements OnInit {
Active_Tab = 'Courses';
  constructor() { }

  ngOnInit() {
  }
Active_Tab_Change(name) {
   this.Active_Tab = name;
}
}
