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
   // Staff's
      import { StaffListComponent } from './Components/Staffs/staff-list/staff-list.component';
      import { StaffCreateComponent } from './Components/Staffs/staff-create/staff-create.component';
      import { StaffViewComponent } from './Components/Staffs/staff-view/staff-view.component';
   // Levels
      import { ListLevelsComponent } from './Components/Levels/list-levels/list-levels.component';
   // Activity
      import { ListActivityComponent } from './Components/Activities/list-activity/list-activity.component';
   // Queries
      import { ListQueriesComponent } from './Components/Queries/list-queries/list-queries.component';
      import { ViewQueriesComponent } from './Components/Queries/view-queries/view-queries.component';
   // Tutor Management
      import { ListTutorManagementComponent } from './Components/Tutor-Management/list-tutor-management/list-tutor-management.component';
   // Institution Management
      import { ListInstitutionManagementComponent } from './Components/Institution-Management/list-institution-management/list-institution-management.component';
      import { ListYearlyBatchesComponent } from './Components/Institution-Management/list-yearly-batches/list-yearly-batches.component';
      import { ListSemesterManagementComponent } from './Components/Institution-Management/list-semester-management/list-semester-management.component';
   // Current Semesters
      import { CurrentSemestersComponent } from './Components/Current-Semesters/current-semesters/current-semesters.component';
   // Configuration
      // User Management
         import { ListUserComponent } from './Components/Configuration/User-Management/list-user/list-user.component';
      // Deportment Config
         import { ListDepartmentComponent } from './Components/Configuration/Department_Config/list-department/list-department.component';
      // Deportment Config
         import { ListInstitutionsComponent } from './Components/Configuration/Institutions_Config/list-institutions/list-institutions.component';
      // Courses Config
         import { ListCoursesComponent } from './Components/Configuration/Courses_Config/list-courses/list-courses.component';
      // Activities Config
         import { ListActivityLevelComponent } from './Components/Configuration/Activities_Config/Activity_Level/list-activity-level/list-activity-level.component';
         import { ListAchievementTypeComponent } from './Components/Configuration/Activities_Config/Achievement_Type/list-achievement-type/list-achievement-type.component';
         import { ListRedemptionMethodComponent } from './Components/Configuration/Activities_Config/Redemption_Method/list-redemption-method/list-redemption-method.component';
         // Subjects Config
         import { ListSubjectsComponent } from './Components/Configuration/Subjects_Config/list-subjects/list-subjects.component';

// models
   // Students
      import { ModelStudentImportComponent } from './models/Students/model-student-import/model-student-import.component';
      import { ModelStudentLinkSemesterComponent } from './models/Students/model-student-link-semester/model-student-link-semester.component';
   // Activities
      import { CreateActivityModelComponent } from './models/Activities/create-activity-model/create-activity-model.component';
      import { ViewActivityModelComponent} from './models/Activities/view-activity-model/view-activity-model.component';
   // Levels
      import { CreateLevelModelComponent } from './models/Levels/create-level-model/create-level-model.component';
      import { ViewLevelModelComponent } from './models/Levels/view-level-model/view-level-model.component';
   // Queries
      import { EditQueriesComponent } from './models/Queries/edit-queries/edit-queries.component';
   // User-Management
      import { CreateUserManagementComponent } from './models/User_Management/create-user-management/create-user-management.component';
   // Tutor Management
      import { ModelTutorManagementCreateComponent } from './models/Tutor-Management/model-tutor-management-create/model-tutor-management-create.component';
      import { ModelTutorManagementViewComponent } from './models/Tutor-Management/model-tutor-management-view/model-tutor-management-view.component';
   // Institution Management
      import { ModelBatchesCreateComponent } from './models/Institution-Management/model-batches-create/model-batches-create.component';
      import { ModelBatchesViewComponent } from './models/Institution-Management/model-batches-view/model-batches-view.component';
      import { ModelSemesterInfoCreateComponent } from './models/Institution-Management/model-semester-info-create/model-semester-info-create.component';
      import { ModelSemesterInfoViewComponent } from './models/Institution-Management/model-semester-info-view/model-semester-info-view.component';
   // Configuration
      // Department Config
         import { ModelDepartmentConfigComponent } from './models/Configurations/model-department-config/model-department-config.component';
      // Department Config
         import { ModelInstitutionConfigComponent } from './models/Configurations/model-institution-config/model-institution-config.component';
      // Courses Config
         import { ModelCourseConfigComponent } from './models/Configurations/model-course-config/model-course-config.component';
      // Activities Config
         import { ModelActivityLevelComponent } from './models/Configurations/Model_Activities_Config/model-activity-level/model-activity-level.component';
         import { ModelAchievementTypeComponent } from './models/Configurations/Model_Activities_Config/model-achievement-type/model-achievement-type.component';
         import { ModelRedemptionMethodComponent } from './models/Configurations/Model_Activities_Config/model-redemption-method/model-redemption-method.component';
         // Subjects Config
         import { ModelSubjectConfigComponent } from './models/Configurations/model-subject-config/model-subject-config.component';





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
      // Staff's
         StaffListComponent,
         StaffCreateComponent,
         StaffViewComponent,
      // Level
         ListLevelsComponent,
      // Activity
         ListActivityComponent,
      // Queries
         ListQueriesComponent,
         ViewQueriesComponent,
      // Tutor Management
         ListTutorManagementComponent,
      // Institution Management
         ListInstitutionManagementComponent,
         ListYearlyBatchesComponent,
         ListSemesterManagementComponent,
      // Current Semesters
         CurrentSemestersComponent,
      // Configuration
         // User Management
            ListUserComponent,
         // Department Config
            ListDepartmentComponent,
         // Institutions Config
            ListInstitutionsComponent,
         // Courses Config
            ListCoursesComponent,
         // Activity Config
            ListActivityLevelComponent,
            ListAchievementTypeComponent,
            ListRedemptionMethodComponent,
         // Subjects Config
            ListSubjectsComponent,
   // models
      // Students
         ModelStudentImportComponent,
         ModelStudentLinkSemesterComponent,
      // Activities
         CreateActivityModelComponent,
         ViewActivityModelComponent,
      // Levels
         CreateLevelModelComponent,
         ViewLevelModelComponent,
      // Queries
         EditQueriesComponent,
      // User-Management
         CreateUserManagementComponent,
      // Institution Management
         ModelBatchesCreateComponent,
         ModelBatchesViewComponent,
         ModelSemesterInfoCreateComponent,
         ModelSemesterInfoViewComponent,
      // Tutor Management
         ModelTutorManagementCreateComponent,
         ModelTutorManagementViewComponent,
      // Configuration
         // Department Config
            ModelDepartmentConfigComponent,
         // Institution Config
            ModelInstitutionConfigComponent,
         // Courses Config
            ModelCourseConfigComponent,
         // Activities Config
            ModelActivityLevelComponent,
            ModelAchievementTypeComponent,
            ModelRedemptionMethodComponent,
         // Subjects Config
            ModelSubjectConfigComponent

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
   ModelStudentImportComponent,
   ModelStudentLinkSemesterComponent,
   ModelSubjectConfigComponent,
   ModelSemesterInfoCreateComponent,
   ModelSemesterInfoViewComponent,
   ModelActivityLevelComponent,
   ModelAchievementTypeComponent,
   ViewActivityModelComponent,
   ModelRedemptionMethodComponent,
   CreateLevelModelComponent,
   ViewLevelModelComponent,
   ModelTutorManagementCreateComponent,
   ModelTutorManagementViewComponent
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
