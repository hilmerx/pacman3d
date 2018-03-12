import * as THREE from 'three'
import {Box} from './Structures'
import {new2DArray} from './Math.js'
import {Cell} from './Cell.js'

let w = 20

export class Tail {
    constructor(master){
        this.arr = []
        this.waveInitArr = []
        this.waveModulo = 0
        this.grid = new2DArray(20, 20)
        this.grid = this.loadBoxes(this.grid)
    }

    manUpdate(){
        this.arr.forEach(tile=>{
            let x = tile.x
            let y = tile.y

            this.grid[x][y].mesh.mesh.visible = true
        })

    }

    hideTail(){
        let grid = this.grid

        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                this.grid[i][j].mesh.mesh.visible = false
            }
        }
    }    

    loadBoxes(grid){
        
        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                let size = 20
                let geometry = new THREE.BoxGeometry( size,  size, size )
                let material = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.2, color: 0xff99ff} )

                let entity = new Box(geometry, material)
                entity.setPosition(i * size, j * size, 0)

                grid[i][j] = new Cell(i, j)


                entity.mesh.visible = false

                grid[i][j].mesh = entity
            }
        }

        return grid
    }

    makeTail(master){
        this.arr.forEach((data) => {
            if (data.wave) {
                // noStroke()
                // fill(200,0,150)
            } else {
                let size = 20
                let geometry = new THREE.BoxGeometry( size,  size, size )
                let material = new THREE.MeshBasicMaterial( {color: 0x0000ff} )

                let tailBuff = new Box(geometry, material)
                tailBuff.setPosition(data.x* w, data.y* w, 20, 20)
                master.addEntity(tailBuff)

            }
            // rect(data.x*w, data.y*w, 20, 20)
        })
    }


    waveInit(x,y) {
        this.arr.forEach((data, nr)=>{
            if (data.x === x && data.y === y && data.wave === false) {
                this.waveInitArr.push([nr, nr])
                data.wave = true
            }
        })
    }

    wave(){
        if (this.waveInitArr.length>0 && this.waveModulo % 2===0){
            this.waveInitArr.forEach( (initSpot)=>{
                let minus = initSpot[0]--
                let plus = initSpot[1]++

                if (minus>=0  && this.waveInitArr.length>0){
                    this.arr[minus].wave = true
                }
                if (plus<this.arr.length && this.waveInitArr.length>0){
                    this.arr[plus].wave = true
                } else {
                    die()
                }
            })
        }
        this.waveModulo++
    }

}



export class TailCell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.waveInit = false
        this.wave = false
        this.lines = [
            {pos: "top", x1:this.x,y1: this.y,x2: this.x+w,y2: this.y},
            {pos: "right", x1:this.x+w,y1: this.y,x2: this.x+w,y2: this.y+w},
            {pos: "bottom", x1:this.x,y1: this.y+w,x2: this.x+w,y2: this.y+w},
            {pos: "left", x1:this.x, y1: this.y, x2: this.x, y2: this.y+w}
        ]
    }
}