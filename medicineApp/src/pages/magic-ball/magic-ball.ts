import { Component} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ModalController, NavController } from 'ionic-angular';


@Component({
  templateUrl: "magic-ball.html", 
})

export class MagicBall {

  answers: any;

  constructor(private navCtrl: NavController){

    this.answers = [
      'Yes',
      'No',
      'Maybe',
      'All signs point to yes',
      'Try again later',
      'Without a doubt',
      'Don\'t count on it',
      'Most likely',
      'Absolutely not'
    ];

  }

  getAnswers(){
    return this.answers;
  }

  getRandomAnswer(){
    return this.answers[this.getRandomInt(0, this.answers.length-1)];
  }

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
