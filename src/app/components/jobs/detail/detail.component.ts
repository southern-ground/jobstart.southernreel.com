import {Component, OnInit, Input} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {Job} from '../../../models/Job';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    id: string;
    sub: any;

    @Input('job') job:Job;

    constructor(private route: ActivatedRoute, public dataService: DataService) {

    }

    toggleHide(e){
        this.job.hide = !this.job.hide;
        e.preventDefault();
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.dataService.getJobsById(this.id).subscribe(res => {
                this.job = res.job;
            });
        });
    }

}
