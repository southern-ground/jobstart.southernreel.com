import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Cookies} from '../../../utilties/cookies';
import {Creator} from '../../../models/Creator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {guid} from '../../../utilties/utilities';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
    cookie: Cookies;
    departmentList: object[] = [{id: "-1", name: '---'}];
    formBuilder: FormBuilder;
    service: DataService;
    hasSavedCreator: boolean = false;
    hasLoaded: boolean = false;
    hasTyped: boolean = false;
    hasSelected: boolean = false;
    creators: Creator[];
    creator: Creator;
    filteredEmployeeList: Creator[] = [];
    newJobForm: FormGroup;
    newUserForm: FormGroup;

    constructor(public dataService: DataService, private fb: FormBuilder) {
        this.cookie = new Cookies();
        this.service = this.dataService;
        this.formBuilder = fb;
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
        let query = this.newJobForm.controls['creator_name'].value;
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

    getNewJobForm() {
        return this.formBuilder.group({
            creator_name: [null, Validators.required],
            creator_id: [null],
            creator_department: ['-1', Validators.required],
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
                let deptId: string = (res.employee.departments.length >= 1) ? res.employee.departments[0].department_id : '';
                let dept: object[] = (this.departmentList.filter(d => {
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
        this.service.addEmployee(form)
            .subscribe(res => {
                if (res.error === 200) {
                    // Successfully added the User
                    this.newJobForm.controls['creator_name'].setValue(res.user.first_name
                        + (res.user.nickname === '' ? '' : ' ' + res.user.nickname) + ' '
                        + res.user.last_name);
                } else {
                    alert('Error ' + res.error + ": " + res.message);
                    this.newUserForm = this.getNewUserForm();
                }
            });
    }

    ngOnInit() {
        let creator = this.cookie.getJobstartCreator();
        let creatorDepartmentId = this.cookie.getCreatorDepartment();

        if (creator) {
            this.hasSavedCreator = true;
            this.creator = creator;
            this.newJobForm.controls['creator_name'].setValue(this.creator.name);
            this.newJobForm.controls['creator_id'].setValue(this.creator.id);
        }
        if (creatorDepartmentId) {
            this.newJobForm.controls['creator_department'].setValue(creatorDepartmentId.id);
        }

        this.service.getEmployees()
            .subscribe(res => {
                this.creators = res.employees.map(e => {
                    let name = e.first_name;
                    name += (e.nickname === '' ? '' : ' ' + e.nickname);
                    name += ' ' + e.last_name;
                    return {
                        employee_id: e.employee_id,
                        id: e.id,
                        name: name
                    };
                });
                this.dataLoaded();
            });
        this.service.getDepartments()
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
