import {Cell} from './Cell.js'
import * as THREE from 'three'
import {Box} from './Structures.js'

let w = 20

export class Field{
    constructor(){
        this.grid = this.new2DArray(20, 20)
        this.grid = this.loadBoxes(this.grid)

        this.getFlood = []
        this.floodArr = []
    }


    floodFill(cell) {
        let grid = this.grid
        if(cell.on === false && cell.hasFlooded === false){
            cell.hasFlooded = true;
            this.floodArr.push(cell.i)

            this.floodFill(grid[cell.i[0]][cell.i[1]+1])
            this.floodFill(grid[cell.i[0]][cell.i[1]-1])
            this.floodFill(grid[cell.i[0]+1][cell.i[1]])
            this.floodFill(grid[cell.i[0]-1][cell.i[1]])

            return this.floodArr
        }
    }


    floodReset() {
        this.floodArr =[];
        for (let i = 0; i<this.grid.length; i++){
            for (let j = 0; j<this.grid[i].length; j++){
                this.grid[i][j].hasFlooded = false
            }
        }
    }

    checkFloodDir(dir){

        if(!dir.on && !dir.hasFlooded && !dir.tail){
            let buffer = this.floodFill(this.grid[dir.i[0]][dir.i[1]])
            this.getFlood.push(buffer)
            this.floodArr = []
        }
    }

    checkArrForMonster(arr) {
        let currentX
        let currentY
        let currentCell
        let currentSpace
        let foundMoster
        let bouncers = [{location:{x:20, y: 20}}]
        for (let i = 0; i<arr.length; i++){
            currentSpace = arr[i]
            foundMoster= false

            for (let ii = 0; ii<currentSpace.length; ii++){
                currentX = currentSpace[ii][0]
                currentY = currentSpace[ii][1]
                currentCell = this.grid[currentX][currentY]

                for (let iii = 0; iii<bouncers.length; iii++){
                    if (this.dist(currentCell.x,currentCell.y, bouncers[iii].location.x, bouncers[iii].location.y) < w){
                        foundMoster = true
                    }
                }
                // for (let iii = 0; iii<eaters.length; iii++){
                //     if (dist(currentCell.x,currentCell.y, eaters[iii].location.x, eaters[iii].location.y) < w){
                //         foundMoster = true
                //     }
                // }
            }
            if (foundMoster) {
                //DO NOTHING
            } else {
                for (let ii = 0; ii<currentSpace.length; ii++){
                    currentX = currentSpace[ii][0]
                    currentY = currentSpace[ii][1]
                    currentCell = this.grid[currentX][currentY]
                    currentCell.on = true
                    currentCell.mesh.mesh.visible = true
                }
            }
        }
    }

    dist(x1, y1, x2, y2){
        return Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2))
    }

    checkFlood(tail) {
        var grid = this.grid

        let x, y, potFloodUp, potFloodDown, potFloodLeft, potFloodRight
        let getFlood  = this.getFlood

        for (let k = 0; k<tail.arr.length;k++){
            x = tail.arr[k].x
            y = tail.arr[k].y
            potFloodDown = grid[x][y+1]
            potFloodUp = grid[x][y-1]
            potFloodRight = grid[x-1][y]
            potFloodLeft = grid[x+1][y]


            this.checkFloodDir(potFloodDown)
            this.checkFloodDir(potFloodUp)
            this.checkFloodDir(potFloodRight)
            this.checkFloodDir(potFloodLeft)

            console.log(this.getFlood);
        }

        this.checkArrForMonster(this.getFlood)
        this.floodReset()
    }

    emptyRoute() {
        for (let i = 0; i<this.grid.length; i++){
            for (let j = 0; j<this.grid[i].length; j++){
                this.grid[i][j].tail = false
            }
        }
    }


    new2DArray(rows, cols){
        let arr = new Array(rows)
        for (let i = 0; i<arr.length; i++){
            arr[i] = new Array(cols)
            for (let j = 0; j<arr[i].length; j++){
                arr[i][j] = 0
            }
        }
        return arr
    }

    loadBoxes(grid){
        
        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                let size = 20
                let geometry = new THREE.BoxGeometry( size,  size, size )
                let material = new THREE.MeshBasicMaterial( {color: 0x0000ff} )

                let entity = new Box(geometry, material)
                entity.setPosition(i * size, j * size, 0)

                grid[i][j] = new Cell(i, j)


                if (i === 0 || j === 0 || i === grid.length-1 || j === grid[i].length-1) {
                    entity.mesh.visible = true
                    grid[i][j].on = true
                    grid[i][j].onPermanent = true
                } else {
                    entity.mesh.visible = false
                }
                grid[i][j].mesh = entity
            }
        }

        return grid
    }

}

