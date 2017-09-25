import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Cookies} from '../../../utilties/cookies';
import {Creator} from '../../../models/Creator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit {
    cookie: Cookies;
    departmentList: object[] = [{id: '-1', name: '---'}];
    hasSavedCreator = false;
    hasLoaded = false;
    hasTyped = false;
    hasSelected = false;
    creators: Creator[];
    creator: Creator;
    filteredEmployeeList: Creator[] = [];
    newJobForm: FormGroup;
    newUserForm: FormGroup;
    minDate: Date;
    maxDate: Date;
    invalidDates: Array<Date>;

    constructor(public dataService: DataService,
                public formBuilder: FormBuilder) {
        this.cookie = new Cookies();
        this.newJobForm = this.getNewJobForm();
        this.newUserForm = this.getNewUserForm();
    }

    clearSavedCreator() {
        this.cookie.deleteJobstartCreator();
        this.newJobForm.controls['creator_name'].setValue(null);
        this.newJobForm.controls['creator_id'].setValue(null);
        this.newJobForm.controls['creator_department'].setValue(-1);
        this.hasSavedCreator = false;
    }

    dataLoaded() {
        this.hasLoaded = true;
    }

    filterEmployees() {
        this.hasSavedCreator = false;
        const query = this.newJobForm.controls['creator_name'].value;
        if (query !== '') {
            this.filteredEmployeeList = this.creators.filter(function (el) {
                return el.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }.bind(this));
            this.hasTyped = true;
        } else {
            this.filteredEmployeeList = [];
            this.hasTyped = this.hasSelected = false;
        }
    }

    getValidDueDate() {
        const futureDueDate = new Date();
        futureDueDate.setDate(futureDueDate.getDate() + 10);

        switch (futureDueDate.getDay()) {
            case 0:
                futureDueDate.setDate(futureDueDate.getDate() + 1);
                break;
            case 6:
                futureDueDate.setDate(futureDueDate.getDate() + 2);
                break;
            default:
            // Nothing
        }

        futureDueDate.setHours(12);
        futureDueDate.setMinutes(0);
        futureDueDate.setSeconds(0);
        futureDueDate.setMilliseconds(0);

        return futureDueDate;
    }

    getNewJobForm() {
        return this.formBuilder.group({
            creator_name: [null, Validators.required],
            creator_id: [null],
            creator_department: ['-1', Validators.required],
            due_date: [this.getValidDueDate(), Validators.required],
            jobTitle: [null, Validators.required],
            jobDescription: [null]
        });
    }

    getNewUserForm() {
        return this.formBuilder.group({
            first_name: [null, Validators.required],
            nickname: '',
            last_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            office_phone: '',
            other_phone: '',
            deleted: '0'
        });
    }

    showUserModal() {
        this.newJobForm.controls['creator_name'].setValue('');
        this.filteredEmployeeList = [];
        this.hasTyped = false;
    }

    onDepartmentSelect(e) {
        console.log('onDepartmentSelect', e);
    }

    onSelectCreator(employee) {
        this.creator = employee;
        this.newJobForm.controls['creator_name'].setValue(employee.name);
        this.filteredEmployeeList = [];
        this.hasTyped = false;
        this.hasSelected = this.hasSavedCreator = true;
        this.dataService.getEmployee(employee.employee_id)
            .subscribe(res => {
                const deptId: string = (res.employee.departments.length >= 1) ? res.employee.departments[0].department_id : '';
                const dept: object[] = (this.departmentList.filter(d => {
                    return d['id'] === deptId;
                }));
                if (dept.length >= 1) {
                    this.newJobForm.controls['creator_department'].setValue(dept[0]['id']);
                }
                this.cookie.setJobstartCreator(employee.name, employee.id);
            });
    }

    onSubmitJobForm(form: any): void {
        console.log('onSubmitJobForm::');
        console.log(form);
    }

    onSubmitUserForm(form: any): void {
        this.dataService.addEmployee(form)
            .subscribe(res => {
                if (res.error === 200) {
                    // Successfully added the User
                    const $ = window['$'];
                    const newCreatorName = res.user.first_name
                        + (res.user.nickname === '' ? '' : ' "' + res.user.nickname) + '" '
                        + res.user.last_name;

                    this.creator = {
                        id: res.user.id,
                        employee_id: res.user.employee_id,
                        name: newCreatorName
                    };

                    this.newJobForm.controls['creator_name'].setValue(this.creator.name);
                    this.newJobForm.controls['creator_id'].setValue(this.creator.employee_id);
                    this.cookie.setJobstartCreator(this.creator.name, this.creator.employee_id);

                    $('#addCreatorModal div.modal-header button').click();
                } else {
                    alert('Error ' + res.error + ': ' + res.message);
                    this.newUserForm = this.getNewUserForm();
                }
            });
    }

    ngOnInit() {

        const creator = this.cookie.getJobstartCreator();
        const creatorDepartmentId = this.cookie.getCreatorDepartment();

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = year + 1;

        this.minDate = new Date();
        this.minDate.setDate(today.getDate() + 3);

        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);

        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today, invalidDate];


        if (creator) {
            this.hasSavedCreator = true;
            this.creator = creator;
            this.newJobForm.controls['creator_name'].setValue(this.creator.name);
            this.newJobForm.controls['creator_id'].setValue(this.creator.id);
        }
        if (creatorDepartmentId) {
            this.newJobForm.controls['creator_department'].setValue(creatorDepartmentId.id);
        }

        this.dataService.getEmployees()
            .subscribe(res => {
                this.creators = res.employees.map(e => {
                    let name = e.first_name;
                    name += (e.nickname === '' ? '' : ' "' + e.nickname + '"');
                    name += ' ' + e.last_name;
                    return {
                        employee_id: e.employee_id,
                        id: e.id,
                        name: name
                    };
                });
                this.dataLoaded();
            });
        this.dataService.getDepartments()
            .subscribe(res => {
                let departments: object[] = res.departments;
                departments.unshift({id: -1, name: '---'});
                this.departmentList = departments;
                this.dataLoaded();
            });

        this.newJobForm.valueChanges.subscribe(data => {
            if (this.cookie.getCreatorDepartment() !== data.creator_department) {
                this.cookie.setCreatorDepartment(data.creator_department);
            }
        });
    }
}
