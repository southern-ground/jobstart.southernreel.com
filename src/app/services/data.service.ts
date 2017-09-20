import {Injectable} from '@angular/core';
import {Job} from '../models/Job';
import {Employee} from '../models/Employee';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
    isLocal: boolean;
    urlPrefix: string;
    jobs: Job[] = [];
    employees: Employee[] = [];

    constructor(public http: Http) {
        this.isLocal = window.location.href.indexOf('localhost') !== -1;
        this.urlPrefix = this.isLocal ? 'http://localhost:8888' : '';
    }

    addEmployee(emp: object) {
        let url = this.urlPrefix + '/api/employee/add/';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .put(url, JSON.stringify(emp), headers)
            .map(res => res.json());
    }

    getEmployee(id: string) {
        return this.http.get(this.urlPrefix + '/api/employee/' + id)
            .map(res => res.json());
    }

    getEmployees() {
        return this.http.get(this.urlPrefix + '/api/employees')
            .map(res => res.json());
    }

    getDepartments() {
        return this.http.get(this.urlPrefix + '/api/departments')
            .map(res => res.json());
    }

    getJobs() {
        return this.http.get(this.urlPrefix + '/api/jobs')
            .map(res => res.json());
    }

    getJobsById(id) {
        return this.http.get(this.urlPrefix + '/api/job/' + id)
            .map(res => res.json());
    }
}
