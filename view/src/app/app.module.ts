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
   import {MatButtonModule,  MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatMenuModule} from '@angular/material';
   import {MatRadioModule} from '@angular/material/radio';
   import { NgSelectModule } from '@ng-select/ng-select';

// Custom Modules;
   import { AppRoutingModule } from './app.routing.module';
   import { AuthGuard } from './Authentication/auth.guard';

// Components
   // Common-Components
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
   // Level Management
      import { CreateLevelComponent } from './Components/Level-Management/create-level/create-level.component';
      import { ListLevelComponent } from './Components/Level-Management/list-level/list-level.component';
      import { ViewLevelComponent } from './Components/Level-Management/view-level/view-level.component';
   // Activity
      import { ListActivityComponent } from './Components/Activities/list-activity/list-activity.component';
   // Queries
      import { ListQueriesComponent } from './Components/Queries/list-queries/list-queries.component';
      import { ViewQueriesComponent } from './Components/Queries/view-queries/view-queries.component';
   // Institution Management
      import { ListInstitutionManagementComponent } from './Components/Institution-Management/list-institution-management/list-institution-management.component';
      import { ListYearlyBatchesComponent } from './Components/Institution-Management/list-yearly-batches/list-yearly-batches.component';
   // Configuration
      // User Management
         import { ListUserComponent } from './Components/Configuration/User-Management/list-user/list-user.component';
      // Deportment Config
         import { ListDepartmentComponent } from './Components/Configuration/Department_Config/list-department/list-department.component';
      // Deportment Config
         import { ListInstitutionsComponent } from './Components/Configuration/Institutions_Config/list-institutions/list-institutions.component';
      // Courses Config
         import { ListCoursesComponent } from './Components/Configuration/Courses_Config/list-courses/list-courses.component';

// models
   // Students
      import { ModelStudentImportComponent } from './models/Students/model-student-import/model-student-import.component';
   // Activities
      import { CreateActivityModelComponent } from './models/Activities/create-activity-model/create-activity-model.component';
   // Queries
      import { EditQueriesComponent } from './models/Queries/edit-queries/edit-queries.component';
   // User-Management
      import { CreateUserManagementComponent } from './models/User_Management/create-user-management/create-user-management.component';
   // Institution Management
      import { ModelBatchesCreateComponent } from './models/Institution-Management/model-batches-create/model-batches-create.component';
      import { ModelBatchesViewComponent } from './models/Institution-Management/model-batches-view/model-batches-view.component';

   // Configuration
      // Department Config
         import { ModelDepartmentConfigComponent } from './models/Configurations/model-department-config/model-department-config.component';
      // Department Config
         import { ModelInstitutionConfigComponent } from './models/Configurations/model-institution-config/model-institution-config.component';
      // Courses Config
         import { ModelCourseConfigComponent } from './models/Configurations/model-course-config/model-course-config.component';




@NgModule({
  declarations: [
   AppComponent,
   // Components
      // Common-Components
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
      // Level Management
         CreateLevelComponent,
         ListLevelComponent,
         ViewLevelComponent,
      // Activity
         ListActivityComponent,
      // Queries
         ListQueriesComponent,
         ViewQueriesComponent,
      // Institution Management
         ListInstitutionManagementComponent,
      // Configuration
         // User Management
            ListUserComponent,
         // Department Config
            ListDepartmentComponent,
         // Institutions Config
            ListInstitutionsComponent,
         // Courses Config
            ListCoursesComponent,
   // models
      // Students
         ModelStudentImportComponent,
      // Activities
         CreateActivityModelComponent,
      // Queries
         EditQueriesComponent,
      // User-Management
         CreateUserManagementComponent,
         ListYearlyBatchesComponent,
      // Institution Management
         ModelBatchesCreateComponent,
         ModelBatchesViewComponent,
      // Configuration
         // Department Config
            ModelDepartmentConfigComponent,
         // Institution Config
            ModelInstitutionConfigComponent,
         // Courses Config
            ModelCourseConfigComponent,

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
      MatDatepickerModule,
      MatNativeDateModule,
   // Custom Modules
      AppRoutingModule,
  ],
  providers: [],
  entryComponents: [
   DeleteConfirmationComponent,
   CreateActivityModelComponent,
   EditQueriesComponent,
   CreateUserManagementComponent,
   ModelDepartmentConfigComponent,
   ModelCourseConfigComponent,
   ModelInstitutionConfigComponent,
   ModelBatchesCreateComponent,
   ModelBatchesViewComponent,
   ModelStudentImportComponent
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
