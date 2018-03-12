import * as THREE from 'three'


let floodArr =[];
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



    showLine() {
        let line
        for (let i = 0; i<this.activeLines.length; i++){
            line = this.activeLines[i]
            if(this.on){
                fill(100,0,0)
                stroke(255,0,255)
                fill(255,120,120)
                bouncers[0].lineShow(line.x1, line.y1, line.x2, line.y2)
            }
        }
    }
    show() {
        if(this.on2){
            noStroke()
            fill(100,0,0)

        }else if (this.on) {
            stroke(1)
            fill(0,0,150)
            rect(this.x, this.y, 20, 20)

        }else{
            noStroke()

        fill(0,0,0,0)
        }
        rect(this.x, this.y, 20, 20)

    }

    lineCheck() {

        this.activeLines = []

        let thisX = this.i[0]
        let thisY = this.i[1]

        let above = thisY-1
        let below = thisY+1
        let left = thisX-1
        let right = thisX+1

        if (above >= 0 && (grid[thisX][above].on === false && grid[thisX][above].tail === false) ) {
            this.activeLines.push(this.lines[0])
        }
        if (left >= 0 && (grid[left][thisY].on === false && grid[left][thisY].tail === false)) {
            this.activeLines.push(this.lines[3])
        }
        if (below < cols && (grid[thisX][below].on === false && grid[thisX][below].tail === false)) {
            this.activeLines.push(this.lines[2])
        }
        if (right < rows && (grid[right][thisY].on === false && grid[right][thisY].tail === false)) {
            this.activeLines.push(this.lines[1])
        }

    }

    lineConsolidation(i) {
        let thisX = this.i[0]
        let thisY = this.i[1]

        let above = thisY-1
        let below = thisY+1
        let left = thisX-1
        let right = thisX+1


        this.activeLines.forEach((data)=>{
            lines.push(data)
        })

    }

}









