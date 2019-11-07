import * as PIXI from 'pixi.js'
import { throttle } from 'lodash'
import { Howl } from 'howler';

let die = new Howl({
    src: ['assets/playerBodySplat.mp3'],
    volume: 0.5
})

export default class Orc extends PIXI.Sprite {
    constructor(resources, app, orcs) {
        super(resources.orc.texture)
        this.position.x = Math.random() * (900 - 10) + 10
        this.position.y = Math.random() * (700 - 10) + 10
        this.rotation = 0
        this.scale.x = 0.2
        this.scale.y = 0.2
        this.alive = true;
        this.speed = Math.random()
        this.age = 0;
        this.spawn = () => {
            app.stage.addChild(this)
            orcs.push(this)
        }
    }
}


// let orcDeath = new Howl({
//     src: ['assets/orcdie.m4a']
// })

