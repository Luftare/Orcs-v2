import * as PIXI from 'pixi.js'
import { Howl, Howler } from 'howler';
import keyboard from './keyboard'
import Vector from './Vector';
import { throttle } from 'lodash'

// SFX
let walk = new Howl({
    src: ['assets/walk.mp3'],
    loop: true,
    volume: 0.5
})

let gun = new Howl({
    src: ['assets/shoot.mp3'],
    loop: true,
    volume: 0.5
})

export default class Player extends PIXI.Sprite {
    constructor(x, y, resources, app, bullets) {
        super(resources.player.texture)
        this.x = x
        this.y = y
        this.scale.x = 0.7
        this.scale.y = 0.7
        this.loadingTime = 40
        this.rotate = 0
        this.velocity = 0
        this.fire = false
        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.hp = 50
        this.setupInput()
        this.shoot = throttle(() => {
            const bulletStartPosition = new Vector(this.x, this.y)
            const gunBarrel = new Vector(20, 0)
            gunBarrel.toAngle(this.rotation)
            bulletStartPosition.add(gunBarrel)
            let bullet = new PIXI.Sprite(resources.bullet.texture)
            bullet.position.x = bulletStartPosition.x
            bullet.position.y = bulletStartPosition.y
            bullet.rotation = this.rotation
            app.stage.addChild(bullet)
            bullets.push(bullet)
        }
            , this.loadingTime)
    }

    setupInput() {
        //Capture the keyboard arrow keys
        let left = keyboard("ArrowLeft"),
            up = keyboard("ArrowUp"),
            right = keyboard("ArrowRight"),
            down = keyboard("ArrowDown"),
            leftCtrl = keyboard("Control")

        //Left arrow key `press` method
        left.press = () => {
            this.rotate -= 0.05
        }

        //Left arrow key `release` method
        left.release = () => {
            this.rotate = 0
        }

        //Up
        up.press = () => {
            this.velocity = 2
            walk.rate(3)
            walk.play()
        }
        up.release = () => {
            this.velocity = 0
            walk.stop()
        }

        //Right
        right.press = () => {
            this.rotate += 0.05
        }
        right.release = () => {
            this.rotate = 0
        }

        //Down
        down.press = () => {
            this.velocity = -1
            walk.rate(1.5)
            walk.play()
        }
        down.release = () => {
            this.velocity = 0
            walk.stop()
        }

        //leftCtrl
        leftCtrl.press = () => {
            this.fire = true
            gun.play()

        }
        leftCtrl.release = () => {
            this.fire = false
            gun.stop()
        }
    }

}


