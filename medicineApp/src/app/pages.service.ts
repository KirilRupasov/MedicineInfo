import { Injectable } from '@angular/core';
import { iMyApp } from './app.interface';

@Injectable()
export class PagesService {
    ComApp: iMyApp;
    public register(comapp: iMyApp) {
        this.ComApp = comapp;
    }
    public logged() {
            this.ComApp.showLoggedMenu()
        
    }
    public nonLogged() {
            this.ComApp.showNonLoggedMenu();
    }   
}