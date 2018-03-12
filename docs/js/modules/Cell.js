import * as THREE from 'three'


let w = 20


export class Cell {
    constructor(x, y){
        this.x = x*w;
        this.y = y*w;
        this.x2 = this.x+w/2
        this.y2 = this.y+w/2
        this.i = [x,y]
        this.on = false
        this.on2 = false
        this.onPermanent = false
        this.hasFlooded = false
        this.tail = false
        this.mesh

        this.lines = [
            {pos: "top", x1:this.x,y1: this.y,x2: this.x+w,y2: this.y},
            {pos: "right", x1:this.x+w,y1: this.y,x2: this.x+w,y2: this.y+w},
            {pos: "bottom", x1:this.x,y1: this.y+w,x2: this.x+w,y2: this.y+w},
            {pos: "left", x1:this.x, y1: this.y, x2: this.x, y2: this.y+w}
        ]
        this.activeLines = []
        this.linesPushed = false
    }
}









