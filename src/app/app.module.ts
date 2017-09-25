import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HttpModule} from '@angular/http';
import {SrlogoComponent} from './components/srlogo/srlogo.component';
import {HomeComponent} from './components/home/home.component';
import {DataService} from './services/data.service';
import {JobComponent} from './components/jobs/job/job.component';
import {JobsComponent} from './components/jobs/jobs.component';
import {NewComponent} from './components/jobs/new/new.component';
import {DetailComponent} from './components/jobs/detail/detail.component';
import {EmployeesComponent} from './components/employees/employees.component';
import {EmployeeComponent} from './components/employee/employee.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CalendarModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appRoutes: Routes = [
    {path: 'jobs', component: JobsComponent},
    {path: 'employees', component: EmployeesComponent},
    {path: 'home', component: HomeComponent},
    {path: 'jobs/new', component: NewComponent},
    {path: 'job/:id', component: DetailComponent},
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SrlogoComponent,
        HomeComponent,
        JobComponent,
        JobsComponent,
        JobComponent,
        EmployeesComponent,
        EmployeeComponent,
        NewComponent,
        DetailComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(
            appRoutes
        ),
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        BrowserAnimationsModule
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
