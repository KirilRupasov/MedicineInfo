import { Suggestions } from './suggestions';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { NavController, NavParams } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';

describe('Suggestions Page Tests', () => {
    let fix: ComponentFixture<Suggestions>;
    let instance: Suggestions;
    let injector: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, Suggestions, Searchbar
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
              {provide: NavController, useClass: NavCtrlMock },
              {provide: NavParams, useClass: NavParamsMock}
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents()
          .then(() => {
            fix = TestBed.createComponent(Suggestions);
            instance = fix.componentInstance;
            injector = fix.debugElement.injector;
          });
    }));

    it('should set suggestions to Ibuprofen and Paracetamol', () => {
        let suggestions = [
        {
            title: "Ibuprofen",
            description: "Painkiller",
            side_effects: "None",
            benefits: "None"
        }, {
            title: "Paracetamol",
            description: "Painkiller",
            side_effects: "None",
            benefits: "None"
        }
        ];
        instance.setSuggestions(suggestions);
        expect(instance.getSuggestions()[0].description_short).toBe("Painkiller...");
    });

    it('should go to Ibuprofen page', async(() => {
        let backend = injector.get(MockBackend);
        let responseBody = {
          title: "Ibuprofen",
          description: "Painkiller",
          side_effects: "None",
          benefits: "None",
          elderly: "No information",
          stores: "lloyds",
          rating: "4"
        };

        backend.connections.subscribe(
            (connection: MockConnection) => {
            connection.mockRespond(new Response(
                new ResponseOptions({
                    body: responseBody
                }
            )));
        });  

        let suggestions = [
            {
                title: "Ibuprofen",
                description: "Painkiller",
                side_effects: "None",
                benefits: "None"
            }, {
                title: "Paracetamol",
                description: "Painkiller",
                side_effects: "None",
                benefits: "None"
            }
        ];

        instance.goToItem(responseBody);
        expect(instance.getNavCtrl().first()).toBe("Ibuprofen");
    }));
});
  
  
  
