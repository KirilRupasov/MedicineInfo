import { MedicineInfo } from './medicineinfo';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AuthMock } from '../../mocks/authMock';
import { ModalCtrlMock } from '../../mocks/modalCtrlMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { AlertCtrlMock } from '../../mocks/alertCtrlMock';
import { UserMock } from '../../mocks/userMock';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { Auth, User } from '@ionic/cloud-angular';
import { PagesService } from '../../providers/pages.service';
import { ModalController, NavController, AlertController, NavParams } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { ReviewModal } from '../reviewModal/reviewModal';

describe('Medicine Info Page Tests', () => {
    let fix: ComponentFixture<MedicineInfo>;
    let instance: MedicineInfo;
    let injector: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, MedicineInfo, Searchbar
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
              {provide: Auth, useClass: AuthMock },
              {provide: AlertController, useClass: AlertCtrlMock },
              {provide: NavController, useClass: NavCtrlMock },
              {provide: NavParams, useClass: NavParamsMock},
              {provide: User, useClass: UserMock},
              {provide: ModalController, useClass: ModalCtrlMock},
              PagesService
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents()
          .then(() => {
            fix = TestBed.createComponent(MedicineInfo);
            instance = fix.componentInstance;
            injector = fix.debugElement.injector;
          });
    }));

    it('should set isLeaveReview to be false', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = "true";
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });         

        instance.setReviewAction();
        expect(instance.isLeaveReview()).toBe(false);
    }));

    it('should open Leave Review as user is authenticated', () => {
        instance.openLeaveReviewModal();
        expect(instance.getModal().NavParams).toEqual(ReviewModal);
    });

    it('should output rating of 3 starts', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = "3";
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });         
        instance.setRating();
        expect(instance.stars.length).toBe(3);
    }));
});
