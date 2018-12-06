import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './Authentication/auth.guard';

// Login
   import { LoginComponent } from '../app/Components/Common-Components/login/login.component';
// DashBoard
   import { DashBoardComponent } from './Components/DashBoard/dash-board/dash-board.component';
// Students
   import { StudentListComponent } from './Components/Students/student-list/student-list.component';
   import { StudentCreateComponent } from './Components/Students/student-create/student-create.component';
   import { StudentViewComponent } from './Components/Students/student-view/student-view.component';
// Staff's
   import { StaffListComponent } from './Components/Staffs/staff-list/staff-list.component';
   import { StaffCreateComponent } from './Components/Staffs/staff-create/staff-create.component';
   import { StaffViewComponent } from './Components/Staffs/staff-view/staff-view.component';
// Levels
   import { ListLevelsComponent } from './Components/Levels/list-levels/list-levels.component';
// Activities
   import { ListActivityComponent } from './Components/Activities/list-activity/list-activity.component';
// Queries
   import { ListQueriesComponent } from './Components/Queries/list-queries/list-queries.component';
   import { ViewQueriesComponent } from './Components/Queries/view-queries/view-queries.component';
// Institution Management
   import { ListInstitutionManagementComponent } from './Components/Institution-Management/list-institution-management/list-institution-management.component';
   import { ListYearlyBatchesComponent } from './Components/Institution-Management/list-yearly-batches/list-yearly-batches.component';
   import { ListSemesterManagementComponent } from './Components/Institution-Management/list-semester-management/list-semester-management.component';
   // Configuration
   // User Management
      import { ListUserComponent } from './Components/Configuration/User-Management/list-user/list-user.component';
   // Department Config
      import { ListDepartmentComponent } from './Components/Configuration/Department_Config/list-department/list-department.component';
   // Courses Config
      import { ListCoursesComponent } from './Components/Configuration/Courses_Config/list-courses/list-courses.component';
   // Deportment Config
      import { ListInstitutionsComponent } from './Components/Configuration/Institutions_Config/list-institutions/list-institutions.component';
   // Activities Config
      import { ListActivityLevelComponent } from './Components/Configuration/Activities_Config/Activity_Level/list-activity-level/list-activity-level.component';
      import { ListAchievementTypeComponent } from './Components/Configuration/Activities_Config/Achievement_Type/list-achievement-type/list-achievement-type.component';
      import { ListRedemptionMethodComponent } from './Components/Configuration/Activities_Config/Redemption_Method/list-redemption-method/list-redemption-method.component';
      // Subjects Config
      import { ListSubjectsComponent } from './Components/Configuration/Subjects_Config/list-subjects/list-subjects.component';

   const appRoutes: Routes = [
      {
         path: '',
         component: LoginComponent,
         data: { animation: { value: 'Login'}  }
      },
      // Login
         {
            path: 'Login',
            component: LoginComponent,
            data: { animation: { value: 'Login'}  }
         },
      // DashBoard
         {
            path: 'Dash_Board',
            component: DashBoardComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Dash_Board'}  }
         },
      // Students
         {
            path: 'Student_List',
            component: StudentListComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Student_List'}  }
         },
         {
            path: 'Student_Create',
            component: StudentCreateComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Student_Create'}  }
         },
         {
            path: 'Student_View',
            component: StudentViewComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Student_View'}  }
         },
      // Staff's
         {
            path: 'Staff_List',
            component: StaffListComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Staff_List'}  }
         },
         {
            path: 'Staff_Create',
            component: StaffCreateComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Staff_Create'}  }
         },
         {
            path: 'Staff_View',
            component: StaffViewComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Staff_View'}  }
         },
      // Level Management
         {
            path: 'List_Level',
            component: ListLevelsComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'List_Level'}  }
         },
      // Activities
         {
            path: 'List_Activity',
            component: ListActivityComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'List_Activity'}  }
         },
      // Queries
         {
            path: 'Queries_List',
            component: ListQueriesComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Queries_List'}  }
         },
         {
            path: 'Queries_View',
            component: ViewQueriesComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Queries_View'}  }
         },
      // Institution Management
         {
            path: 'Institution_Management',
            component: ListInstitutionManagementComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Institution_Management'}  }
         },
         {
            path: 'Institution_Management/:Institution_Id',
            component: ListInstitutionManagementComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Institution_Management'}  }
         },
         {
            path: 'Yearly_Batches/:InsManagement_Id',
            component: ListYearlyBatchesComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Yearly_Batches'}  }
         },
         {
            path: 'Semester_Management/:YearlyBatch_Id',
            component: ListSemesterManagementComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Semester_Management'}  }
         },
      // Configuration
         // User Management
            {
               path: 'User_List',
               component: ListUserComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'User_List'}  }
            },
         // Department Config
            {
               path: 'Departments_Config',
               component: ListDepartmentComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Departments_Config'}  }
            },
         // Department Config
            {
               path: 'Institutions_Config',
               component: ListInstitutionsComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Institutions_Config'}  }
            },
         // Courses Config
            {
               path: 'Courses_Config',
               component: ListCoursesComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Courses_Config'}  }
            },
         // Activities Config
            {
               path: 'Activity_Levels',
               component: ListActivityLevelComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Activity_Levels'}  }
            },
            {
               path: 'Achievement_Types',
               component: ListAchievementTypeComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Achievement_Types'}  }
            },
            {
               path: 'Redemption_Methods',
               component: ListRedemptionMethodComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Redemption_Methods'}  }
            },
         // Subjects Config
            {
               path: 'Subjects_Config',
               component: ListSubjectsComponent,
               canActivate: [AuthGuard],
               data: { animation: { value: 'Subjects_Config'}  }
            },
];

@NgModule({
   declarations: [ ],
   imports: [ RouterModule.forRoot(appRoutes,
       { enableTracing: true }
     )],
   providers: [],
   bootstrap: []
 })
 export class AppRoutingModule { }
