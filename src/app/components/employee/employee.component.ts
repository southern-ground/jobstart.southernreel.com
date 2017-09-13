import {Component, OnInit, Input} from '@angular/core';
import {Employee} from '../../models/Employee';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

    @Input('employee') employee: Employee;

    constructor() {
    }

    ngOnInit() {

    }

    toggleHide(e) {
        console.log('toggleHide');
        this.employee.hide = !this.employee.hide;
        e.preventDefault();
    }

}
