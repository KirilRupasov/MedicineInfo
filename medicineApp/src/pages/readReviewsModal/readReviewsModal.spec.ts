import { ReadReviewsModal } from './readReviewsModal';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NavParamsMockModal } from '../../mocks/navParamsMockModal';
import { ViewCtrlMock } from '../../mocks/viewCtrlMock';
import { ViewController, NavParams } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';

describe('Read Reviews Modal Page Tests', () => {
    let fix: ComponentFixture<ReadReviewsModal>;
    let instance: ReadReviewsModal;
    let injector: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, ReadReviewsModal, Searchbar
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
              {provide: ViewController, useClass: ViewCtrlMock}
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents()
          .then(() => {
            fix = TestBed.createComponent(ReadReviewsModal);
            injector = fix.debugElement.injector;
          });
    }));

    it('should output review with "Good Medicine" content', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = [
            {
                user_email: "abc@abc.com",
                review_content: "Good Medicine",
                rating: 5
            }
        ];
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          });
        
        instance = fix.componentInstance;  
        instance.loadReviews();   
        expect(instance.reviews[0].review_content).toBe("Good Medicine");
    }));

    it('should output review with 5-star rating', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = [
            {
                user_email: "abc@abc.com",
                review_content: "Good Medicine",
                rating: 5
            }
        ];
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          }); 
        instance = fix.componentInstance; 
        instance.loadReviews();      
        expect(instance.reviews[0].rating).toBe(5);
    }));

    it('should output review with "Good Medicine" content', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = [
            {
                user_email: "abc@abc.com",
                review_content: "Good Medicine",
                rating: 5
            }
        ];
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          }); 
        instance = fix.componentInstance; 
        
        instance.loadReviews();      
        expect(instance.reviews[0].review_content).toBe("Good Medicine");
    }));

    it('should output review written by user with email "abc@abc.com"', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = [
            {
                user_email: "abc@abc.com",
                review_content: "Good Medicine",
                rating: 5
            }
        ];
        backend.connections.subscribe(
          (connection: MockConnection) => {
            connection.mockRespond(new Response(
              new ResponseOptions({
                  body: responseBody
                }
              )));
          }); 
        instance = fix.componentInstance; 
        instance.loadReviews();      
        expect(instance.reviews[0].user_email).toBe("abc@abc.com");
    }));
});
