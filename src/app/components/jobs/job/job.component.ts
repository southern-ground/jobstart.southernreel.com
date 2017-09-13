import { Component, OnInit, Input } from '@angular/core';
import {Job} from '../../../models/Job';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input('job') job:Job;

  constructor() { }

  ngOnInit() {
  }

}
