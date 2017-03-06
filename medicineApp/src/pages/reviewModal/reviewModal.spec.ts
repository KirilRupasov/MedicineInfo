import { ReviewModal } from './reviewModal';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NavParamsMockModal } from '../../mocks/navParamsMockModal';
import { ViewCtrlMock } from '../../mocks/viewCtrlMock';
import { AuthMock } from '../../mocks/authMock';
import { UserMock } from '../../mocks/userMock';
import { AlertCtrlMock } from '../../mocks/alertCtrlMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { ViewController, NavParams, AlertController, NavController } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { Auth, User } from '@ionic/cloud-angular';


let mainMenu = null;

describe('Review Modal Page Tests', () => {
    let fix: ComponentFixture<ReviewModal>;
    let instance: ReviewModal;
    let injector: any;

    beforeEach(() => {
        const viewControllerStub = new ViewController();
        TestBed.configureTestingModule({
            declarations: [
                MyApp, ReviewModal, Searchbar
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
              MockBackend,
              BaseRequestOptions,
              {
                provide: Http,
                useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
                  return new Http(backend, options);
                },
                deps: [ MockBackend, BaseRequestOptions ]
              },
              {provide: NavParams, useClass: NavParamsMockModal},
              {provide: ViewController, useClass: ViewCtrlMock},
              {provide: User, useClass: UserMock},
              {provide: Auth, useClass: AuthMock},
              {provide: AlertController, useClass: AlertCtrlMock},
              {provide: NavController, useClass: NavCtrlMock}
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents()
          .then(() => {
            fix = TestBed.createComponent(ReviewModal);
            injector = fix.debugElement.injector;
          });
    }));

    it('should output empty fields with rating set to 1 by default', async(() => {        
        instance = fix.componentInstance;    
        expect(instance.rating).toBe(1);
    }));

    it('should submit a review successfully', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = "Submitted!";
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });
        
        instance = fix.componentInstance;  
        instance.review = "Good Medicine";
        instance.leaveReview();  
        expect(instance.getAlert().subTitle).toBe("Review submitted!");
    }));

    it('should NOT let submit a review because it is too long', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = "Submitted!";
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });
        
        instance = fix.componentInstance;  
        instance.review = "Lorem ipsum dolor sit amet, sunt ligula sodales, non reprehenderit et pharetra mollis ut, urna integer erat, aliquam phasellus eget ullamcorper tempus nonummy at. Sollicitudin in maecenas maecenas, sed viverra volutpat, imperdiet euismod ligula donec, adipiscing enim          elementum ut praesent nonummy, dolor a non. Quis mauris non ullamcorper lectus non a. Urna justo tortor, elit in tortor eget felis, eu luctus diam. Est nullam vestibulum. Nec enim, curae ornare dolor praesent, hendrerit massa placerat, nunc blandit blandit, at mauris tincidunt nulla         vehicula. Odio nascetur diam euismod tortor leo donec, ac at ornare scelerisque dignissim eget, quisque libero nunc proin eu placerat lobortis, curabitur ut eros vivamus, nec suspendisse lectus arcu. Arcu praesent";
        instance.leaveReview();  
        expect(instance.getAlert().subTitle).toBe("Review is longer than 600 characters!");
    }));

    it('should NOT let submit a review because no review is written', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = "Submitted!";
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });
        
        instance = fix.componentInstance;  
        instance.leaveReview();  
        expect(instance.getAlert().subTitle).toBe("No review is written!");
    }));
});
