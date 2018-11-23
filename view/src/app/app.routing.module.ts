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
// Level Management
   import { ListLevelComponent } from './Components/Level-Management/list-level/list-level.component';
   import { CreateLevelComponent } from './Components/Level-Management/create-level/create-level.component';
   import { ViewLevelComponent } from './Components/Level-Management/view-level/view-level.component';
// Activities
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
   // Department Config
      import { ListDepartmentComponent } from './Components/Configuration/Department_Config/list-department/list-department.component';
   // Courses Config
      import { ListCoursesComponent } from './Components/Configuration/Courses_Config/list-courses/list-courses.component';
   // Deportment Config
      import { ListInstitutionsComponent } from './Components/Configuration/Institutions_Config/list-institutions/list-institutions.component';

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
      // Level Management
         {
            path: 'Level_List',
            component: ListLevelComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Level_List'}  }
         },
         {
            path: 'Level_Create',
            component: CreateLevelComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Level_Create'}  }
         },
         {
            path: 'Level_View',
            component: ViewLevelComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Level_View'}  }
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
            path: 'Yearly_Batches/:InsManagement_Id',
            component: ListYearlyBatchesComponent,
            canActivate: [AuthGuard],
            data: { animation: { value: 'Yearly_Batches'}  }
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
