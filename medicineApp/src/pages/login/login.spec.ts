import { Login } from './login';
import { TestBed, async } from '@angular/core/testing';
import { AuthMock } from '../../mocks/authMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { AlertCtrlMock } from '../../mocks/alertCtrlMock';
import { Auth } from '@ionic/cloud-angular';
import { NavController, AlertController } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MainMenu } from '../mainmenu/mainmenu';

let login = null;

describe('Login Page Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, Login, Searchbar, MainMenu
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: Auth, useClass: AuthMock },
                {provide: AlertController, useClass: AlertCtrlMock },
                {provide: NavController, useClass: NavCtrlMock },
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should NOT log in because of invalid credentials', () => {
        const test = TestBed.createComponent(Login);
        login = test.componentInstance;
        login.email_value = "abc@abc.com";
        login.password_value = "123";
        login.login();
        expect(login.getAuth().isAuthenticated()).toBe(false);
    });

    it('should NOT login because no password provided', () => {
        const test = TestBed.createComponent(Login);
        login = test.componentInstance;
        login.email_value = "abc@abc.com";
        login.login();
        expect(login.getAuth().isAuthenticated()).toBe(false);
    });

    it('should NOT login because no login provided', () => {
        const test = TestBed.createComponent(Login);
        login = test.componentInstance;
        login.email_value = "abc@abc.com";
        login.login();
        expect(login.getAuth().isAuthenticated()).toBe(false);
    });

   it('should log in', () => {
        const test = TestBed.createComponent(Login);
        login = test.componentInstance;
        login.email_value = "abc@abc.com";
        login.password_value = "123123";
        login.login();
        expect(login.getAuth().isAuthenticated()).toBe(true);
    });
});
