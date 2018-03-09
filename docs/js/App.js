import {loadScene} from './modules/Scene.js'
import {KeyboardState} from './modules/Keyboard.js'


Promise.all([
    loadScene()
]).then(([master])=>{

    function render() {
        requestAnimationFrame(render)
        master.update()
    }
    render()
})















