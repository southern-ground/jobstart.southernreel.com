import {Creator} from '../models/Creator';

export class Cookies {

    readonly COOKIE_NAME: string = "jobstart.southernreel.com";
    readonly JOBSTART_CREATOR: string = "creator";
    readonly JOBSTART_CREATOR_DEPARTMENT: string = "creator_department";
    readonly COOKIE_EXPIRE_DAYS: number = 5;
    private isRegistered: boolean = false;

    constructor() {
        this.isRegistered = this.getCookie(this.COOKIE_NAME) === '1';
    }

    private getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }

        return '';
    }

    private deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    private setCookie(name: string, value: string, expireDays: number = this.COOKIE_EXPIRE_DAYS, path: string = '') {
        let d: Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires: string = `expires=${d.toUTCString()}`;
        let cpath: string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }

    public deleteJobstartCreator() {
        this.deleteCookie(this.JOBSTART_CREATOR);
        this.deleteCookie(this.JOBSTART_CREATOR_DEPARTMENT);
    }

    public getCreatorDepartment() {
        let currentCookie: string = this.getCookie(this.JOBSTART_CREATOR_DEPARTMENT);
        if (currentCookie.length !== 0) {
            return JSON.parse(currentCookie);
        }
        return null;
    }

    public setCreatorDepartment(departmentId: string) {
        this.setCookie(this.JOBSTART_CREATOR_DEPARTMENT, JSON.stringify({
            id: departmentId
        }), this.COOKIE_EXPIRE_DAYS);
    }

    public getJobstartCreator() {
        let currentCookie: string = this.getCookie(this.JOBSTART_CREATOR);
        if (currentCookie.length !== 0) {
            return JSON.parse(currentCookie);
        }
        return null;
    }

    public setJobstartCreator(employee: Creator) {
        this.setCookie(this.JOBSTART_CREATOR, JSON.stringify(employee), this.COOKIE_EXPIRE_DAYS);
    }
}