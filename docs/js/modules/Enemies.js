import * as THREE from 'three'
import InnerMonster from './InnerMonster'
import {Vec3} from './Math'



export class Bouncer extends InnerMonster{
    constructor() {
        super()

        this.location = new Vec3(80, 80, -2)
        this.type = 'bouncer'
        this.d = 16
        this.r = 10
        this.mass = 10
        this.angleArr = [-90, -180]
        this.angleArr = [0, -180]
        // this.angle = (180 - 45) * Math.random(1) * (Math.PI / 180);
        this.angle = 270 *Math.random(1)* (Math.PI / 180);

        this.origSpeed = 2
        this.speed = this.origSpeed
        this.speedTemp = this.speed
        this.angleTemp = this.angle

        this.geometry = new THREE.SphereGeometry( 8, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0x22ff00} )
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.ID = this.mesh.uuid
        this.setPosition(this.location.x-10, this.location.y-10, this.location.z)
    }

    setPosition(x, y = 0, z) {
        this.mesh.position.set(x, y, z)
    }

    update(master) {
        this.collideWithTail(master)
        this.collideWithBorder(master.field.consolidatedLines)
        // if (gameActive) {
        this.walk()
        this.setPosition(this.location.x-10, this.location.y-10, this.location.z)
        // this.collideWithPacman()
    }


    collideWithBorder(lines){
        let collidingLines = this.lineCollideCheck(lines)
        let collidingLineEnd = this.lineEndCollideCheck(lines)
        if (collidingLines.length > 0) {
            collidingLines.forEach((line) => {
                this.bounce(line)
            })
            return
        } else if (collidingLineEnd) {
            this.endPointBounce(collidingLineEnd)
        } else {
            //DO NOTHING
        }
    }
}


export class Eater extends InnerMonster{
    constructor(id) {
        super()

        this.location = new Vec3(28 + (id * 50) * 2, 200 - (id * 8), 2)
        this.type = 'eater'

        this.d = 16
        this.r = 8
        this.mass = 10
        this.angleArr = [-90, -180]
        this.angleArr = [0, -180]
        this.angle = (180 ) * (Math.PI / 180);

        this.origSpeed = 2
        this.speed = this.origSpeed
        this.speedTemp = this.speed
        this.angleTemp = this.angle

        this.geometry = new THREE.SphereGeometry( 8, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0x22ff00} )
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.ID = this.mesh.uuid
    }

    update() {
        
    }

    collideWithBorder(){
        collidingLines =this.lineCollideCheck/**/()
        collidingLineEnd =this.lineEndCollideCheck()
        if (collidingLines.length>0) {
            collidingLines.forEach((line) => {
                this.bounce(line)
                this.eatCell()
            })
            return
        } else if (collidingLineEnd) {
            this.endPointBounce(collidingLineEnd)
            this.eatCell()
        } else {
          //DO NOTHING
        }
    }


    eatCell(){
        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                if(this.squareCollide(i,j) && grid[i][j].onPermanent === false) {
                    grid[i][j].on = false
                    initLineChecks()
                    if (grid[i][j].x2 === pacman.x && grid[i][j].y2 === pacman.y) {
                        pacman.direction = pacman.lastDirection
                        pacman.flying = true;
                    }
                }
            }
        }
    }
}
