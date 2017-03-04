import { Signup } from './signup';
import { TestBed, async } from '@angular/core/testing';
import { AlertCtrlMock } from '../../mocks/alertCtrlMock';
import { AuthMock } from '../../mocks/authMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { Auth } from '@ionic/cloud-angular';
import { NavController, AlertController } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MainMenu } from '../mainmenu/mainmenu';

let signup = null;

describe('Signup Page Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, Signup, Searchbar, MainMenu
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: Auth, useClass: AuthMock },
                {provide: NavController, useClass: NavCtrlMock },
                {provide: AlertController, useClass: AlertCtrlMock}
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should sign up properly', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.email_value = "abc@abc.com";
        signup.email_confirm_value = "abc@abc.com";
        signup.password_value = "123123";
        signup.password_confirm_value = "123123";
        signup.register();
        expect(signup.getAuth().isAuthenticated()).toBe(true);
    });

    it('should alert that passwords do not match', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.email_value = "abc@abc.com";
        signup.email_confirm_value = "abc@abc.com";
        signup.password_value = "123123";
        signup.password_confirm_value = "123120";
        signup.register();
        expect(signup.getAlert().subTitle).toBe("Passwords do not match!");
    });

    it('should alert that emails do not match', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.email_value = "abc@abc.com";
        signup.email_confirm_value = "abc2@abc.com";
        signup.password_value = "123123";
        signup.password_confirm_value = "123123";
        signup.register();
        expect(signup.getAlert().subTitle).toBe("Emails do not match!");
    });

    it('should not let to authenticate because password is not provided', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.email_value = "abc@abc.com";
        signup.email_confirm_value = "abc@abc.com";
        signup.register();
        expect(signup.getAuth().isAuthenticated()).toBe(false);
    });

    it('should not let to authenticate because emails is not provided', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.password_value = "123123";
        signup.password_confirm_value = "123123";
        signup.register();
        expect(signup.getAuth().isAuthenticated()).toBe(false);
    });

    it('should not let to authenticate as email is taken', () => {
        const test = TestBed.createComponent(Signup);
        signup = test.componentInstance;
        signup.email_value = "abc2@abc.com";
        signup.email_confirm_value = "abc2@abc.com";
        signup.password_value = "123123";
        signup.password_confirm_value = "123123";
        signup.register();
        expect(signup.getAuth().isAuthenticated()).toBe(false);
    });
});
