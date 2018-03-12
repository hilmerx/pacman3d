import {Cell} from './Cell.js'
import * as THREE from 'three'
import {Box} from './Structures.js'
import {dist, new2DArray} from './Math.js'

let w = 20
let cols = 20
let rows = 20

export class Field{
    constructor(master){
        this.grid = new2DArray(20, 20)
        this.grid = this.loadBoxes(this.grid)

        this.getFlood = []
        this.floodArr = []

        this.lines = []
        this.consolidatedLines = []
        this.initLineChecks(master)
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

    // Floodfill methods


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

    checkArrForMonster(floodAreas, enemies) {
        let currentX
        let currentY
        let currentCell
        let area
        let foundMoster

        for (let i = 0; i<floodAreas.length; i++){
            area = floodAreas[i]
            foundMoster= false

            for (let ii = 0; ii<area.length; ii++){
                currentX = area[ii][0]
                currentY = area[ii][1]
                currentCell = this.grid[currentX][currentY]

                for (let iii = 0; iii<enemies.length; iii++){
                    if (dist(currentCell.x,currentCell.y, enemies[iii].location.x, enemies[iii].location.y) < w){
                        foundMoster = true
                    }
                }
            }
            if (foundMoster) {
                //DO NOTHING
            } else {
                for (let ii = 0; ii<area.length; ii++){
                    currentX = area[ii][0]
                    currentY = area[ii][1]
                    currentCell = this.grid[currentX][currentY]
                    currentCell.on = true
                    currentCell.mesh.mesh.visible = true
                }
            }
        }
        console.log("hej")
    }

    checkFlood(tail, monsters) {
        var grid = this.grid

        let x, y, potFloodUp, potFloodDown, potFloodLeft, potFloodRight

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

        }

        this.checkArrForMonster(this.getFlood, monsters)
        this.floodReset()
    }



    emptyRoute() {
        for (let i = 0; i<this.grid.length; i++){
            for (let j = 0; j<this.grid[i].length; j++){
                this.grid[i][j].tail = false
            }
        }
    }



    // Line methods

    initLineChecks(master) {

        let grid = this.grid

        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if (grid[i][j].on === true || grid[i][j].tail === true){
                    this.lineCheck(grid[i][j])
                }
            }
        }

        let fieldMeshChildren = master.scene.children[0].children
        let fieldContainer = master.scene.children[0]

        if ( fieldMeshChildren.length > 0) {
            this.emptyWalls(this.consolidatedLines, fieldMeshChildren, fieldContainer)
        }

        this.consolidatedLines = this.consolidateLines()

        this.createWalls(this.consolidatedLines, master)
    }

    emptyWalls(lines, children, scene) {
        for (var i = 0; i < lines.length; i++) {
            for (var j = 0; j < children.length; j++) {
                if( lines[i].ID === children[j].uuid){
                    scene.remove(children[j])
                }
            }
        }

    }


    createWalls(lines, master) {
        lines.forEach(lineData=>{
            this.createWall(lineData, master)
        })
        
    }

    createWall(data, master){
        function minimumThickness(wall){
            if(wall === 0) {
                wall = 2
            } else {
                return wall
            }
            return wall
        }

        let distX = Math.abs(data.x1 - data.x2-4)
        let distY = Math.abs(data.y1 - data.y2-4)
        
        distX = minimumThickness(distX)
        distY = minimumThickness(distY)

        let geometry = new THREE.BoxGeometry( distX,  distY, 25 )
        let material = new THREE.MeshBasicMaterial( {color: 0xff00ff} )

        let wall = new Box(geometry, material)
        // if (data.pos === 'bottom' || data.pos === 'top'){
        //     wall.setPosition(data.x1 + 180-10, data.y1-10, 0)
        // }

        // if (data.pos === 'left' || data.pos === 'right'){
        //     wall.setPosition(data.x1 -10, data.y1+ 180-10, 0)
        // }
            wall.setPosition(data.x1 + distX/2 -11, data.y1+ distY/2 -11, 0)

        data.ID = wall.ID
        master.addEntity(wall)

    }

    lineCheck(cell) {

        cell.activeLines = []

        let grid = this.grid
        let thisX = cell.i[0]
        let thisY = cell.i[1]

        let above = thisY-1
        let below = thisY+1
        let left = thisX-1
        let right = thisX+1

        if (above >= 0 && (grid[thisX][above].on === false && grid[thisX][above].tail === false) ) {
            cell.activeLines.push(cell.lines[0])
        }
        if (left >= 0 && (grid[left][thisY].on === false && grid[left][thisY].tail === false)) {
            cell.activeLines.push(cell.lines[3])
        }
        if (below < cols && (grid[thisX][below].on === false && grid[thisX][below].tail === false)) {
            cell.activeLines.push(cell.lines[2])
        }
        if (right < rows && (grid[right][thisY].on === false && grid[right][thisY].tail === false)) {
            cell.activeLines.push(cell.lines[1])
        }

    }



    consolidateLines(){



        let grid = this.grid
        let linesY = []
        let linesX = []
        let allLines = []
        let consolidatedLines = []

        let y
        let x
        let smallestX
        let smallestY
        let lastItem
        let largestX
        let largestY
        let newLine
        let mult

        for (let j = 0; j < cols; j++){
            for (let i = 0; i < rows; i++){
                if (grid[i][j].activeLines.length > 0){

                    grid[i][j].activeLines.forEach((data)=>{
                        allLines.push(data)
                    })
                }
            }
        }
        for (let i = 0; i < allLines.length; i++){
            allLines[i].checked = false
        }

        for (let i = 0; i<allLines.length; i++){
            let l1 = allLines[i]
            if (l1.y1 === l1.y2) {
                mult = 1
                for (let j = 0; j < allLines.length; j++){
                    let l2 = allLines[j]
                    if (l1.y1 === l2.y1 && l1.y2 === l2.y2 && l2.checked === false && i !== j && l1.x1 === l2.x1-w*mult) {
                        linesY.push(l2)
                        allLines[j].checked = true
                        mult++
                    }
                }

                if (linesY.length > 0){
                    y = l1.y1
                    smallestX = l1.x1
                    lastItem = linesY.length-1
                    largestX = linesY[lastItem].x2
                    newLine = {pos: l1.pos, x1: smallestX ,y1: y , x2: largestX, y2: y}

                    consolidatedLines.push(newLine)

                    allLines[i].checked = true
                    linesY = []
                } else if (linesY.length===0 && allLines[i].checked === false) {
                    y = l1.y1
                    smallestX = l1.x1
                    largestX = l1.x2
                    newLine = {pos: l1.pos, x1: smallestX ,y1: y , x2: largestX, y2: y}

                    consolidatedLines.push(newLine)
                }
            }

            if (l1.x1 === l1.x2) {
                mult = 1
                for (let j = 0; j<allLines.length; j++){
                    let l2 = allLines[j]
                    if (l1.x1 === l2.x1 && l1.x2 === l2.x2 && l2.checked === false && i !== j && l1.y1 === l2.y1-w*mult){
                        linesX.push(l2)
                        allLines[j].checked = true
                        mult++
                    }
                }

                if (linesX.length>0){
                    x = l1.x1
                    smallestY = l1.y1
                    lastItem = linesX.length-1
                    largestY = linesX[lastItem].y2
                    newLine = {pos: l1.pos, x1: x ,y1: smallestY , x2: x, y2: largestY}

                    consolidatedLines.push(newLine)

                    allLines[i].checked = true
                    linesX = []
                } else if (linesX.length===0 && allLines[i].checked === false) {
                    x = l1.x1
                    smallestY = l1.y1
                    largestY = l1.y2
                    newLine = {pos: l1.pos, x1: x ,y1: smallestY , x2: x, y2: largestY}

                    consolidatedLines.push(newLine)
                }
            }

            allLines[i].checked = true

        }
        return consolidatedLines
    }
}



