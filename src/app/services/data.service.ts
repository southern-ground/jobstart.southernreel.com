import {Injectable} from '@angular/core';
import {Job} from '../models/Job';
import {Employee} from '../models/Employee';
import {Http} from '@angular/http';
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

    getEmployees() {
        return this.http.get(this.urlPrefix + '/api/employees')
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
