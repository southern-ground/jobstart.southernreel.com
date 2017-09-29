import {Component, OnInit} from '@angular/core';
import {Employee} from '../../models/Employee';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    public user: Employee;

    constructor(private dataService: DataService) {
    }

    clearCreator(e) {
        this.dataService.updateCurrentUser(null);
        e.preventDefault();
        e.stopPropagation();
    }

    ngOnInit() {
        this.dataService.currentUser$
            .subscribe(res => {
                this.user = res;
            });
        this.dataService.getCurrentUser()
            .subscribe(res => {
                this.user = res;
            });
    }

}
