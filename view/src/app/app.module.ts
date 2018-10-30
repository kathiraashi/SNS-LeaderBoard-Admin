// Default Modules
   import { NgModule } from '@angular/core';
   import { CommonModule} from '@angular/common';
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { BrowserModule } from '@angular/platform-browser';
   import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
   import { FormsModule, ReactiveFormsModule } from '@angular/forms';
   import { HttpModule } from '@angular/http';
   import { RouterModule, Routes } from '@angular/router';

// Default Components
   import { AppComponent } from './app.component';

// Future Modules
   import { ModalModule, AccordionModule} from 'ngx-bootstrap';
   import {CalendarModule} from 'primeng/calendar';
   import {MatButtonModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatMenuModule} from '@angular/material';
   import {MatRadioModule} from '@angular/material/radio';
   import { NgSelectModule } from '@ng-select/ng-select';

// Custom Modules;
   import { AppRoutingModule } from './app.routing.module';

// Components
   // Commo-Components
      // Header
         import { HeaderComponent } from './Components/Common-Components/header/header.component';
            import { DeleteConfirmationComponent } from './Components/Common-Components/delete-confirmation/delete-confirmation.component';
      // Login
         import { LoginComponent } from './Components/Common-Components/login/login.component';
   // DashBoard
      import { DashBoardComponent } from './Components/DashBoard/dash-board/dash-board.component';
   // Students
      import { StudentCreateComponent } from './Components/Students/student-create/student-create.component';
      import { StudentListComponent } from './Components/Students/student-list/student-list.component';
      import { StudentViewComponent } from './Components/Students/student-view/student-view.component';
   // Configuration
      // Institution
         import { ListInstitutionComponent } from './Components/Configuration/Institution/list-institution/list-institution.component';
         import { CreateInstitutionComponent } from './Components/Configuration/Institution/create-institution/create-institution.component';
         import { ViewInstitutionComponent } from './Components/Configuration/Institution/view-institution/view-institution.component';
      // User Management
         import { CreateUserComponent } from './Components/Configuration/User-Management/create-user/create-user.component';
         import { ListUserComponent } from './Components/Configuration/User-Management/list-user/list-user.component';
         import { ViewUserComponent } from './Components/Configuration/User-Management/view-user/view-user.component';
      // Level Management
         import { CreateLevelComponent } from './Components/Configuration/Level-Management/create-level/create-level.component';
         import { ListLevelComponent } from './Components/Configuration/Level-Management/list-level/list-level.component';
         import { ViewLevelComponent } from './Components/Configuration/Level-Management/view-level/view-level.component';
      // Activity
         import { ListActivityComponent } from './Components/Configuration/Activities/list-activity/list-activity.component';
      // Queries
         import { ListQueriesComponent } from './Components/Configuration/Queries/list-queries/list-queries.component';
         import { ViewQueriesComponent } from './Components/Configuration/Queries/view-queries/view-queries.component';

// models
   // Institution
      import { CreateDepartmentModelComponent } from './models/Institution/create-department-model/create-department-model.component';
      import { CreateCourseModelComponent } from './models/Institution/create-course-model/create-course-model.component';
      import { CreateExtraCurricularActivitiesModelComponent } from './models/Institution/create-extra-curricular-activities-model/create-extra-curricular-activities-model.component';
      import { CreateStaffsModelComponent } from './models/Institution/create-staffs-model/create-staffs-model.component';
   // Activities
      import { CreateActivityModelComponent } from './models/Activities/create-activity-model/create-activity-model.component';
   // Queries
      import { EditQueriesComponent } from './models/Queries/edit-queries/edit-queries.component';
   // User-Management
      import { CreateUserManagementComponent } from './models/User_Management/create-user-management/create-user-management.component';





@NgModule({
  declarations: [
   AppComponent,
   // Components
      // Commo-Components
         // Header
            HeaderComponent,
            DeleteConfirmationComponent,
         // Login
            LoginComponent,
      // DashBoard
         DashBoardComponent,
      // Students
         StudentCreateComponent,
         StudentListComponent,
         StudentViewComponent,
      // Configuration
         // Institution
            ListInstitutionComponent,
            CreateInstitutionComponent,
            ViewInstitutionComponent,
         // User Management
            CreateUserComponent,
            ListUserComponent,
            ViewUserComponent,
         // Level Management
            CreateLevelComponent,
            ListLevelComponent,
            ViewLevelComponent,
         // Activity
            ListActivityComponent,
         // Queries
            ListQueriesComponent,
            ViewQueriesComponent,
   // models
      // Institution
         CreateDepartmentModelComponent,
         CreateCourseModelComponent,
         CreateExtraCurricularActivitiesModelComponent,
         CreateStaffsModelComponent,
      // Activities
         CreateActivityModelComponent,
      // Queries
         EditQueriesComponent,
      // User-Management
         CreateUserManagementComponent,

  ],
  imports: [
   // Default Modules
      BrowserModule,
      BrowserAnimationsModule,
      RouterModule,
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
   // future modules
      ModalModule.forRoot(),
      AccordionModule.forRoot(),
      MatButtonModule,
      CalendarModule,
      NgSelectModule,
      MatFormFieldModule,
      MatSelectModule,
      MatCheckboxModule,
      MatMenuModule,
      MatRadioModule,
   // Custom Modules
      AppRoutingModule,
  ],
  providers: [],
  entryComponents: [
   DeleteConfirmationComponent,
   CreateDepartmentModelComponent,
   CreateCourseModelComponent,
   CreateExtraCurricularActivitiesModelComponent,
   CreateStaffsModelComponent,
   CreateActivityModelComponent,
   EditQueriesComponent,
   CreateUserManagementComponent
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
