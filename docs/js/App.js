import {KeyboardState} from './modules/Keyboard.js'
import {Box} from './modules/Structures.js'
import {Pac} from './modules/Pac.js'
import {Bouncer, Eater} from './modules/Enemies.js'
import {Tail} from './modules/Tail.js'
import {Field} from './modules/Field.js'
import SceneManager from './modules/SceneManager.js'

import * as THREE from 'three'


function loadScene(){
    //Init scene
    let master = new SceneManager(canvas1)
    master.camera.position.z = 700
    //Lights
    let light1 = {
        type: new THREE.AmbientLight( 0x888888),
        pos: [50,50,50]
    }
    master.addLight(light1)

    let light2 = {
        type: new THREE.PointLight( 0xffffff, 1, 100 ),
        pos: [50,50,50]
    }
    master.addLight(light2)

    master.field = new Field(master)
    master.addGrid(master.field.grid, 'grid')

    master.tail = new Tail()
    master.addGrid(master.tail.grid, 'tail')

    let floor = new Box(new THREE.BoxGeometry( 400,  400, 20 ), new THREE.MeshBasicMaterial( {color: 0x333333} ))
    floor.setPosition(200-10, 200-10, -20)
    master.addEntity(floor)

    let pacman = new Pac()
    pacman.setStartPosition(0, 0)
    pacman.listenTo(window)
    master.addEntity(pacman)

    let green = new Bouncer()
    green.setStartPosition(100, 300)
    master.addEntity(green)

    let green2 = new Bouncer()
    green2.setStartPosition(100, 100)
    master.addEntity(green2)

    let red = new Eater()
    red.setStartPosition(140, 300)
    master.addEntity(red)

    let red2 = new Eater()
    red2.setStartPosition(200, 300)
    master.addEntity(red2)
    
    return master
}

Promise.all([
    loadScene()
]).then(([master])=>{

    function render() {
        requestAnimationFrame(render)
        master.update()
    }
    render()
})



