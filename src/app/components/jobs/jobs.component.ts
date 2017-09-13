import {Component, OnInit} from '@angular/core';
import {Job} from '../../models/Job';
import {DataService} from '../../services/data.service';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
    jobs:Job[] = [];
    constructor(public dataService: DataService) {

    }

    ngOnInit() {
        this.dataService.getJobs().subscribe(res=>{
            this.jobs = res.jobs;
        });
    }

}