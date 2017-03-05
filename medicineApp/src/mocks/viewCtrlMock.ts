import { ComponentRef, ElementRef, EventEmitter, Renderer } from '@angular/core';

export class ViewCtrlMock {
    readReady: EventEmitter<any>;
    writeReady: EventEmitter<any>;

    constructor() {
        this.readReady = new EventEmitter<number>();
        this.writeReady = new EventEmitter<number>();
    }

    dismiss() {
        
    }


    _setHeader() {

    }

    _setIONContent() {

    }

    _setIONContentRef() {

    }

    _setNavbar() {

    }

    
}