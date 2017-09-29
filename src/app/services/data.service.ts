import {EventEmitter, Injectable} from '@angular/core';
import {Employee} from '../models/Employee';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Cookies} from '../utilities/cookies';

@Injectable()

export class DataService {
    private _currentUser: Observable<Employee>;
    private _cookies: Cookies;
    private _departments: Observable<Array<Object>>;
    private _employee: Observable<Employee>;
    private _employees: Observable<Array<Employee>>;
    private _isLocal: boolean;
    private _urlPrefix: string;

    public currentUser$: EventEmitter<Employee>;

    constructor(public http: Http) {
        this._cookies = new Cookies();
        this._isLocal = window.location.href.indexOf('localhost') !== -1;
        this._urlPrefix = this._isLocal ? 'http://localhost:8888' : '';
        this.currentUser$ = new EventEmitter();
    }

    addEmployee(emp: object) {
        let url = this._urlPrefix + '/api/employee/add/';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .put(url, JSON.stringify(emp), headers)
            .map(res => res.json());

    }

    addJobstart(job: object){
        let url = this._urlPrefix + '/api/add/job/';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .put(url, JSON.stringify(job), headers)
            .map(res => res.json());
    }

    getCurrentUser() {
        var employee: any = this._cookies.getCurrentUser();
        this._currentUser = new Observable(o => {
            o.next(employee);
        });
        this.currentUser$.emit(employee);
        return this._currentUser;
    }

    getDepartments() {
        this._departments = new Observable(observer => {
            this.http.get(this._urlPrefix + '/api/departments')
                .map(res => res.json())
                .subscribe(res => {
                    if (res.departments) {
                        res.departments.map(dept => {
                            observer.next(dept);
                        });
                    }
                });
        });
        return this._departments;
    }

    getEmployee(id: string) {
        let employee = new Observable(observer => {
            this.http.get(this._urlPrefix + '/api/employee/' + id)
                .map(res => res.json())
                .subscribe(emp => {
                    const departments = emp.employee.departments || [];
                    const employee = {
                        ...emp.employee,
                        department: departments[0]['department_id'] || -1,
                        full_name: this.getFullName(emp.employee),
                        hidden: false
                    }
                    this.currentUser$.emit(employee);
                    observer.next(employee);
                });
        });
        return employee;
    }

    getEmployees() {
        this._employees = new Observable(observer => {
            this.http.get(this._urlPrefix + '/api/employees')
                .map(res => res.json())
                .subscribe(res => {
                    if (res.employees) {
                        res.employees.map(emp => {
                            observer.next({
                                ...emp,
                                department: '',
                                full_name: this.getFullName(emp),
                                hidden: false
                            });
                        });
                        observer.complete();
                    }
                });
        });
        return this._employees;
    }

    getFullName(employee: Employee): string {
        return employee.first_name +
            (employee.nickname ? ' ' + employee.nickname + ' ' : ' ' ) +
            employee.last_name;
    }

    getJobs() {
        console.log('DataService::getJobs');
        return this.http.get(this._urlPrefix + '/api/jobs')
            .map(res => res.json());
    }

    getJobsById(id) {
        return this.http.get(this._urlPrefix + '/api/job/' + id)
            .map(res => res.json());
    }

    updateCurrentUser(employee) {
        if (employee) {
            this._currentUser = new Observable(observer => {
                observer.next(employee);
            });
            this._cookies.cookieEmployee(employee);
        } else {
            this._cookies.deleteJobstartCreator();
            this.getCurrentUser();
        }

        return this._currentUser;
    }
}
