import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';

export class User {
    constructor(public name: string) {
    }
}

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
    creators: User[] = [];
    constructor(public dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.getEmployees()
            .subscribe(res => {
                res.employees.forEach(emp => {
                    this.creators.push(new User(emp.first_name
                        + (emp.nickname !== '' ? ' "' + emp.nickname + '" ' : ' ')
                        + emp.last_name));
                });
            });
    }

}
