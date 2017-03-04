/*import { MagicBall } from './magic-ball';
import { TestBed, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';

let magicBall = null;

describe('Magic 8 Ball Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: NavController, useValue: {} }],
            declarations: [ MagicBall ],
        });
      //magicBall = new MagicBall();
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should return a non empty array', async(() => {
            const magicBall = TestBed.createComponent(MagicBall);

            let result = magicBall.componentInstance.getAnswers();

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toBeGreaterThan(0);
        }
    ));

    it('should return one random answer as a string', async(() => {
            const magicBall = TestBed.createComponent(MagicBall);
            expect(typeof magicBall.componentInstance.getRandomAnswer()).toBe('string');
        }
    ));

    it('should have both yes and no available in result set', async(() => {
            const magicBall = TestBed.createComponent(MagicBall);
            let result = magicBall.componentInstance.getAnswers();

            expect(result).toContain('Yes');
            expect(result).toContain('No');

        }
    ));

});*/
