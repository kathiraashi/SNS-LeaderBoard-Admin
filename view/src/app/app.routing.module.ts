import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Login
   import { LoginComponent } from '../app/Components/Common-Components/login/login.component';
// DashBoard
   import { DashBoardComponent } from './Components/DashBoard/dash-board/dash-board.component';
// Students
   import { StudentListComponent } from './Components/Students/student-list/student-list.component';
   import { StudentCreateComponent } from './Components/Students/student-create/student-create.component';
   import { StudentViewComponent } from './Components/Students/student-view/student-view.component';
// Configuration
   // Institution
      import { ListInstitutionComponent } from './Components/Configuration/Institution/list-institution/list-institution.component';
      import { CreateInstitutionComponent } from './Components/Configuration/Institution/create-institution/create-institution.component';
      import { ViewInstitutionComponent } from './Components/Configuration/Institution/view-institution/view-institution.component';
   // User Management
      import { ListUserComponent } from './Components/Configuration/User-Management/list-user/list-user.component';
   // Level Management
      import { ListLevelComponent } from './Components/Configuration/Level-Management/list-level/list-level.component';
      import { CreateLevelComponent } from './Components/Configuration/Level-Management/create-level/create-level.component';
      import { ViewLevelComponent } from './Components/Configuration/Level-Management/view-level/view-level.component';
   // Activities
      import { ListActivityComponent } from './Components/Configuration/Activities/list-activity/list-activity.component';
   // Queries
      import { ListQueriesComponent } from './Components/Configuration/Queries/list-queries/list-queries.component';
      import { ViewQueriesComponent } from './Components/Configuration/Queries/view-queries/view-queries.component';
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
      data: { animation: { value: 'Dash_Board'}  }
   },
   // Students
   {
      path: 'Student_List',
      component: StudentListComponent,
      data: { animation: { value: 'Student_List'}  }
   },
   {
      path: 'Student_Create',
      component: StudentCreateComponent,
      data: { animation: { value: 'Student_Create'}  }
   },
   {
      path: 'Student_View',
      component: StudentViewComponent,
      data: { animation: { value: 'Student_View'}  }
   },
   // Configuration
      // Institution
      {
         path: 'Institution_List',
         component: ListInstitutionComponent,
         data: { animation: { value: 'Institution_List'}  }
      },
      {
         path: 'Institution_Create',
         component: CreateInstitutionComponent,
         data: { animation: { value: 'Institution_Create'}  }
      },
      {
         path: 'Institution_View',
         component: ViewInstitutionComponent,
         data: { animation: { value: 'Institution_View'}  }
      },
      // User Management
      {
         path: 'User_List',
         component: ListUserComponent,
         data: { animation: { value: 'User_List'}  }
      },
      // Level Management
      {
         path: 'Level_List',
         component: ListLevelComponent,
         data: { animation: { value: 'Level_List'}  }
      },
      {
         path: 'Level_Create',
         component: CreateLevelComponent,
         data: { animation: { value: 'Level_Create'}  }
      },
      {
         path: 'Level_View',
         component: ViewLevelComponent,
         data: { animation: { value: 'Level_View'}  }
      },
      // Activities
      {
         path: 'List_Activity',
         component: ListActivityComponent,
         data: { animation: { value: 'List_Activity'}  }
      },
      // Queries
      {
         path: 'Queries_List',
         component: ListQueriesComponent,
         data: { animation: { value: 'Queries_List'}  }
      },
      {
         path: 'Queries_View',
         component: ViewQueriesComponent,
         data: { animation: { value: 'Queries_View'}  }
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
