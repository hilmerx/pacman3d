import * as THREE from 'three'
import {TailCell} from './Tail.js'

let w = 20
let cols = 20
let rows = 20

export class Pac {
    constructor(){
        this.geometry = new THREE.SphereGeometry( 10, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} )
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.traits = []
        this.type = 'pacman'

        this.x = this.mesh.position.x
        this.y = this.mesh.position.y

        this.ID = this.mesh.uuid
        this.visible = this.mesh.visible
        this.solid = false

        this.alive = true
        this.direction = ''
        this.lastDirection = ''
        this.keyIsPressed = false
        this.tail = false
        this.flying = false
        this.aniSpeed = 4
        this.prevX = w / 2
        this.prevY = w / 2
        this.r = 9

    }

    addTrait(trait) {
        this.traits.push(trait)
    }

    setPosition(x, y, z = 0) {
        this.mesh.position.set(x, y, z)

    }
    setStartPosition(x, y, dir = 'right', z = 20) {
        this.mesh.position.set(x, y, z)
        this.x = x
        this.y = y
        // this.direction = dir
    }

    update(master, tail){

        this.move()
        this.moveAni()

        this.take(master, tail)
    }


    move() {
        let moduloX = false 
        let moduloY = false
        if (this.mesh.position.y % this.y === 0 || isNaN(this.mesh.position.y % this.y) ){
            moduloY = true
        }

        if (this.mesh.position.x % this.x === 0 || isNaN(this.mesh.position.x % this.x)){
            moduloX = true
        }

        switch (this.direction) {
        case 'up': 
            if(this.y<(cols*w)-w && moduloY && moduloX){
                this.prevX = this.x
                this.prevY = this.y
                this.y = this.y + w

            }
            break
        case 'down': if(this.y>w/2 && moduloY && moduloX){
            this.prevX = this.x
            this.prevY = this.y
            this.y = this.y - w
        }
            break
        case 'right': if (this.x<(rows*w)-w && moduloX && moduloY) {
            this.prevY = this.y
            this.prevX = this.x
            this.x = this.x + w
        }
            break
        case 'left': if(this.x>w/2 && moduloX && moduloY){
            this.prevY = this.y
            this.prevX = this.x
            this.x = this.x - w
        }
            break
        }

    }
    moveAni() {

        if (this.direction === "up" && this.mesh.position.y<(cols*w)-w && this.y > this.mesh.position.y || this.y > this.mesh.position.y){
            this.mesh.position.y = this.mesh.position.y + this.aniSpeed
            return
        }
        else if (this.direction === "down" && this.y>w/2 && this.y < this.mesh.position.y || this.y < this.mesh.position.y){
            this.mesh.position.y = this.mesh.position.y - this.aniSpeed
            return
        }
        else if (this.direction === "right" && this.aniX<(rows*w)-w && this.x > this.mesh.position.x || this.x > this.mesh.position.x){
            this.mesh.position.x = this.mesh.position.x + this.aniSpeed
            return
        }
        else if (this.direction === "left" && this.mesh.position.x>w/2 && this.x < this.mesh.position.x || this.x < this.mesh.position.x){
            this.mesh.position.x = this.mesh.position.x - this.aniSpeed
            return
        }

    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                let keyCode = event.keyCode
                if (eventName === 'keydown') {
                    if (keyCode === 39){
                        if(this.flying && this.direction === "left") {
                            return
                        }else {
                            this.keyIsPressed = true;
                            this.direction = "right"
                            this.lastDirection = this.direction
                        }

                    }
                    else if (keyCode === 37){
                        if(this.flying && this.direction === "right") {
                            return
                        }else{
                            this.keyIsPressed = true;

                            this.direction = "left"
                            this.lastDirection = this.direction
                        }
                    }
                    else if (keyCode === 38){
                        if(this.flying && this.direction==="down"){
                            return
                        }else{
                            this.keyIsPressed = true;

                            this.direction = "up"
                            this.lastDirection = this.direction

                        }
                    }
                    else if (keyCode === 40){
                        if(this.flying && this.direction === "up"){
                            return
                        }else{
                            this.keyIsPressed = true

                            this.direction = "down"
                            this.lastDirection = this.direction

                        }
                    }
                }

                if (eventName === 'keyup') {
                    if (this.direction==="right" && keyCode===39 && !this.flying){
                        this.keyIsPressed=false
                        this.direction = ""

                    }
                    else if (this.direction==="left" && keyCode===37 && !this.flying){
                        this.keyIsPressed=false

                        this.direction=""

                    }
                    else if (this.direction==="up" && keyCode===38 && !this.flying){
                        this.keyIsPressed=false

                        this.direction=""

                    }
                    else if (this.direction==="down" && keyCode===40 && !this.flying){
                        this.keyIsPressed=false
                        this.direction=""
                    }
                }

            })
        })
    }



    take(master, tailInput){
        let field = master.field
        let grid = field.grid
        let tail = tailInput
        for (let i = 0; i<rows;i++){
            for (let j = 0; j<cols;j++){
                if(this.x === grid[i][j].x && this.y === grid[i][j].y && grid[i][j].on === false){
                    this.flying = true
                }


                if(this.prevX === grid[i][j].x && this.prevY === grid[i][j].y && grid[i][j].on === false && grid[i][j].tail === false && this.flying === true){
                    grid[i][j].tail = true
                    tail.arr.push(new TailCell(i,j))
                    master.field.initLineChecks(master)

                }
            }
        }

        for (let i = 0; i<rows;i++){
            for (let j = 0; j<cols;j++){
                if(this.x === grid[i][j].x && this.y === grid[i][j].y && grid[i][j].on === true && this.flying){
                    for (let k = 0; k<tail.arr.length;k++){
                        grid[tail.arr[k].x][tail.arr[k].y].mesh.mesh.visible = true
                        grid[tail.arr[k].x][tail.arr[k].y].on = true
                        grid[tail.arr[k].x][tail.arr[k].y].tail = false
                    }

                    field.checkFlood(tail, master.enemies)
                    tail.arr = []
                    tail.waveInitArr = []
                    tail.hideTail()
                    field.emptyRoute()
                    field.initLineChecks(master)
                    this.flying = false
                    master.countScore()

                    this.direction = ''
                }
            }
        }


        for (let i = 0; i < tail.arr.length - 1;i++){
            if (tail.arr[i].x === (this.x) /w && tail.arr[i].y === (this.y) /w){
                master.die()
            }
        }
    }
}


