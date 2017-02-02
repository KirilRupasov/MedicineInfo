import { MainMenu } from './mainmenu';
import { Http } from '@angular/http';
import { ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';

let mainMenu = null;

describe('Main Menu Service', () => {

    beforeEach(() => {
      mainMenu = new MainMenu(new ModalController(), new NavController(), new Http(), new ViewController());
    });

    it('should return an empty array', () => {
        let result = mainMenu.getSuggestions();

        expect(Array.isArray(result)).toBeTruthy;
        expect(result.length).toBe(0);
    });

   it('should return array with suggestions', () => {
      let new_suggestions:any[] = [
        { title: "MockDrug", description: "This is just a basic description", side_effects: "Some basic side effects" },
        { title: "MockDrug-2", description: "This is another mockDrug description", side_effects: "Nausea" }
      ];
      mainMenu.setSuggestions(new_suggestions);
      let result = mainMenu.getSuggestions();

      expect(Array.isArray(result)).toBeTruthy;
      expect(result.length).toBe(2);
      expect(result[1].title).toBe("MockDrug-2");
   });

   it('should call alert', () => {
      spyOn(window, 'alert');
      mainMenu.goToItem("some stuff");
      expect(window.alert).toHaveBeenCalledWith('Error! Product not provided!');
   });
});
