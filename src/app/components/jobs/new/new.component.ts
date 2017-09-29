import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Employee} from '../../../models/Employee';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit {

    currentUser: Employee;
    dataLoaded = false;
    departmentList: object[] = [{id: '-1', name: '---'}];
    dueDate: Date;
    employee: Employee;
    employees: any[] = [];
    filteredEmployeeList: Employee[];
    hasSelected = false;
    hasTyped = false;
    invalidDates: Array<Date>;
    maxDate: Date;
    minDate: Date;
    newJobForm: FormGroup;
    newUserForm: FormGroup;
    addUserFormDisabled: boolean = false;

    constructor(private dataService: DataService,
                private formBuilder: FormBuilder) {
    }

    clearSavedCreator() {
        this.dataService.updateCurrentUser(null);
    }

    filterEmployees() {
        const query = this.newJobForm.controls['creator_name'].value;
        if (query !== '') {
            this.filteredEmployeeList = this.employees
                .filter(employee => {
                    return employee.full_name.toLowerCase()
                        .indexOf(query.toLowerCase()) > -1;
                });
            this.hasTyped = true;
        } else {
            this.filteredEmployeeList = [];
            this.hasTyped = this.hasSelected = false;
        }
    }

    getNewJobForm() {
        return this.formBuilder.group({
            creator_name: [null, Validators.required],
            creator_id: [null],
            creator_department: ['-1', Validators.required],
            due_date: [this.dueDate, Validators.required],
            additional_dates: [''],
            job_title: [null, Validators.required],
            job_description: ['', Validators.required],
            has_creative: false,
            has_web: false,
            has_pr: false,
            has_social: false,
            has_photo: false,
            job_deliverables: ['', Validators.required],
            kickoff_availability: ['', Validators.required],
            other_people: ['']
        });
    }

    getNewUserForm() {
        return this.formBuilder.group({
            first_name: [null, Validators.required],
            nickname: '',
            last_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
            department: ["-1", Validators.required],
            department_list: [],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            office_phone: '',
            other_phone: '',
            deleted: '0'
        });
    }

    onSelectCreator(employee) {
        this.employee = employee;
        this.newJobForm.controls['creator_name'].setValue(employee.full_name);
        this.newJobForm.controls['creator_id'].setValue(employee.employee_id);
        this.filteredEmployeeList = [];
        this.hasTyped = false;
        this.hasSelected = true;

        this.dataService.getEmployee(employee.employee_id)
            .subscribe(res => {
                this.employee = res as Employee;
                const deptId: string = (res['departments'].length >= 1) ? res['departments'][0].department_id : '';
                const dept: object[] = (this.departmentList.filter(d => {
                    return d['id'] === deptId;
                }));
                if (dept.length >= 1) {
                    this.newJobForm.controls['creator_department'].setValue(dept[0]['id']);
                }
                this.dataService.updateCurrentUser(employee)
                    .subscribe(res => {
                        this.currentUser = res;
                    });

            });
    }

    onSubmitJobForm(form: any): void {
        console.log('onSubmitJobForm::');
        console.dir(form);
        this.dataService.addJobstart(form)
            .subscribe(res => {
                if (res['error'] === 200) {
                    // Job successfully added.
                } else {
                    // Something went pear-shaped.
                    alert('Error ' + res['error'] + ': ' + res['message']);
                }
            });
    }

    onSubmitUserForm(form: any): void {
        this.dataService.addEmployee(form)
            .subscribe(addResponse => {
                if (addResponse.error === 200) {
                    // Successfully added the User
                    this.addUserFormDisabled = true;
                    this.employees = [];
                    const id = addResponse['user']['employee_id'];
                    this.dataService.getEmployees()
                        .subscribe(employeesResponse => {
                            this.employees = employeesResponse;
                            if (employeesResponse['employee_id'] === id) {
                                this.onSelectCreator(employeesResponse);
                                this.addUserFormDisabled = false;
                                window['jQuery']('#addCreatorModal div.modal-header button').click();
                            }
                        });
                } else {
                    alert('Error ' + addResponse.error + ': ' + addResponse.message);
                    this.newUserForm = this.getNewUserForm();
                }
            });
    }

    showUserModal() {
        this.newJobForm.controls['creator_name'].setValue('');
        this.filteredEmployeeList = [];
        this.hasTyped = false;
    }

    ngOnInit() {

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

        this.dueDate = new Date();
        this.dueDate.setDate(today.getDate() + 14);
        switch (this.dueDate.getDay()) {
            case 0:
                this.dueDate.setDate(this.dueDate.getDate() + 1);
                break;
            case 6:
                this.dueDate.setDate(this.dueDate.getDate() + 2);
                break;
            default:
            // Nothing
        }
        this.dueDate.setHours(12);
        this.dueDate.setMinutes(0);
        this.dueDate.setSeconds(0);
        this.dueDate.setMilliseconds(0);

        const invalidDate = new Date();

        invalidDate.setDate(today.getDate() - 1);

        this.invalidDates = [today, invalidDate];

        this.newJobForm = this.getNewJobForm();
        this.newUserForm = this.getNewUserForm();

        this.dataService.getCurrentUser()
            .subscribe(res => {
                if (res) {
                    this.currentUser = res as Employee;
                    this.newJobForm.controls['creator_name'].setValue(this.currentUser.full_name);
                    this.newJobForm.controls['creator_id'].setValue(this.currentUser.employee_id);
                    if (!this.currentUser.department) {
                        this.dataService.getEmployee(this.currentUser.employee_id)
                            .subscribe(res => {
                                this.currentUser.department = res['department'];
                                this.newJobForm.controls['creator_department'].setValue(this.currentUser['department']['department_id']);
                                this.dataService.updateCurrentUser(this.currentUser);
                            });
                    } else {
                        this.newJobForm.controls['creator_department'].setValue(this.currentUser['department']['department_id']);
                    }
                }

            });

        this.dataService.getEmployees()
            .subscribe(res => {
                this.employees.push(res);
                this.dataLoaded = this.employees.length > 0 && this.departmentList.length > 0;
            });

        this.dataService.getDepartments()
            .subscribe(res => {
                this.departmentList.push(res);
                this.dataLoaded = this.employees.length > 0 && this.departmentList.length > 0;
            });

        this.newJobForm.valueChanges.subscribe(data => {
            // console.warn('this.newJobForm.valueChanges');
            // console.log(data);
            // TODO: Determine if this is necessary.
        });

        /*
        this.newUserForm.valueChanges.subscribe(data => {
            // TODO: Determine if this is necessary.
        });
        */

        this.dataService.currentUser$.subscribe(res => {
            if (res) {
                this.currentUser = res;
            } else {
                // Clearing it out.
                this.employee = this.currentUser = res;
                this.newJobForm.controls['creator_name'].setValue(null);
                this.newJobForm.controls['creator_id'].setValue(null);
                this.newJobForm.controls['creator_department'].setValue(-1);
            }
        });
    }
}
