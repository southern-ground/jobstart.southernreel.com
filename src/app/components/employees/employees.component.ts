import {Component, OnInit} from '@angular/core';
import {Employee} from '../../models/Employee';
import {DataService} from '../../services/data.service';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
    employees: Employee[];

    constructor(public dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.getEmployees().subscribe(res => {
            console.log(res);
            // this.employees = res.employees;
        });
    }

}
