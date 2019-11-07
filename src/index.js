import * as PIXI from 'pixi.js'
import keyboard from './keyboard'
import Vector from './Vector';
import { Howl, Howler } from 'howler';


//https://github.com/kittykatattack/learningPixi

const app = new PIXI.Application({ width: 1000, height: 800 })

app.renderer.backgroundColor = 0x2b2a19

document.body.appendChild(app.view)


app.loader
    .add('player', 'assets/player.png')
    .add('orc', 'assets/orc.png')
    .add('bullet', 'assets/projectile.png')
    .load((loader, resources) => {

        //initialize player
        const player = new PIXI.Sprite(resources.player.texture)
        player.x = app.renderer.width / 2
        player.y = app.renderer.height / 2
        player.scale.x = 0.7
        player.scale.y = 0.7
        player.loadingTime = 10
        player.counter = 0
        player.rotate = 0
        player.velocity = 0
        player.fire = false
        player.anchor.x = 0.5
        player.anchor.y = 0.5
        player.hp = 1000

        //const gui = document.getElementById("scoreboard")
        let killed = 0;
        //gui.innerHTML = "Orcs killed: " + killed

        //initialize orcs
        let orc = new PIXI.Sprite(resources.orc.texture)
        let orcTexture = new PIXI.Texture(resources.orc.texture)
        let orcs = []
        let orcSpeed = 1
        let orcSpawnTimeout = 0

        //initialize projectiles
        let bullet = new PIXI.Sprite(resources.bullet.texture)
        let bulletTexture = new PIXI.Texture(resources.bullet.texture)
        bullet.x = player.x
        bullet.y = player.y
        let bullets = []
        let bulletSpeed = 5

        function spawnOrc() {
            let orc = new PIXI.Sprite(orcTexture)
            orc.position.x = Math.random() * (900 - 10) + 10
            orc.position.y = Math.random() * (700 - 10) + 10
            orc.rotation = 0
            orc.alive = true;
            orc.speed = Math.random()
            orc.age = 0;
            app.stage.addChild(orc)
            orcs.push(orc)
        }

        function shoot(rotation, startPosition) {
            let bullet = new PIXI.Sprite(bulletTexture)
            bullet.position.x = startPosition.x
            bullet.position.y = startPosition.y
            bullet.rotation = rotation
            bullet.time = 0
            app.stage.addChild(bullet)
            bullets.push(bullet)
        }


        // Add the player to the scene we are building
        app.stage.addChild(player)

        // Listen for frame updates
        app.ticker.add(delta => gameLoop(delta))

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

        let orcDeath = new Howl({
            src: ['assets/orcdie.m4a']
        })

        let die = new Howl({
            src: ['assets/playerBodySplat.mp3'],
            volume: 0.5
        })


        //Capture the keyboard arrow keys
        let left = keyboard("ArrowLeft"),
            up = keyboard("ArrowUp"),
            right = keyboard("ArrowRight"),
            down = keyboard("ArrowDown"),
            leftCtrl = keyboard("Control")

        //Left arrow key `press` method
        left.press = () => {
            player.rotate -= 0.05
        }

        //Left arrow key `release` method
        left.release = () => {
            player.rotate = 0
        }

        //Up
        up.press = () => {
            player.velocity = 2
            walk.rate(3)
            walk.play()
        }
        up.release = () => {
            player.velocity = 0
            walk.stop()
        }

        //Right
        right.press = () => {
            player.rotate += 0.05
        }
        right.release = () => {
            player.rotate = 0
        }

        //Down
        down.press = () => {
            player.velocity = -1
            walk.rate(1.5)
            walk.play()
        }
        down.release = () => {
            player.velocity = 0
            walk.stop()
        }

        //leftCtrl
        leftCtrl.press = () => {
            player.fire = true
            gun.play()

        }
        leftCtrl.release = () => {
            player.fire = false
            gun.stop()
        }

        let state = play

        function gameLoop(delta) {
            //Update the game
            state(delta)
        }

        function play(delta) {
            //update player position
            player.x += player.velocity * Math.cos(player.rotation)
            player.y += player.velocity * Math.sin(player.rotation)
            //update player rotation    
            player.rotation += player.rotate

            let playerPosition = new Vector(player.x, player.y)

            //spawn some orcs

            if (orcSpawnTimeout > 100) {
                spawnOrc()
                orcSpawnTimeout = 0
                //console.log("spawned")
            }
            orcSpawnTimeout++


            //update orc position and check if alive
            for (let o = orcs.length - 1; o >= 0; o--) {
                orcs[o].position.x += orcs[o].speed
                orcs[o].position.y += orcs[o].speed
                let orcPosition = new Vector(orcs[o].position.x, orcs[o].position.y)
                if (orcPosition.distance(playerPosition) < 100) {
                    //console.log("Player taking DMG")
                    player.hp--
                }

                if (!orcs[o].alive) {
                    //orcs = orcs.splice(o, 1)
                    ////ORC DIES///
                    console.log("orc died")

                }
                //check orc / bullet collision
                for (let b = bullets.length - 1; b >= 0; b--) {
                    let bulletPosition = new Vector(bullets[b].position.x, bullets[b].position.y)
                    if (bulletPosition.distance(orcPosition) < 100) {
                        orcs[o].alive = false
                        app.stage.removeChild(orcs[o])
                        killed++
                        console.log("Orcs killed: " + killed)
                    }
                }
                //console.log(orcs[o].age)
                if (orcs[o].age > 1000) {
                    orcs[o].alive = false
                    app.stage.removeChild(orcs[o])
                }
                orcs[o].age++
            }
            let newOrcList = []
            orcs.forEach((orc) => {
                if (orc.alive) {
                    newOrcList.push(orc)
                }
            })
            orcs = newOrcList
            //console.log(orcs.length)
            //update bullet position
            for (let b = bullets.length - 1; b >= 0; b--) {
                bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed
                bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed
                // bullets[b].time++
                // console.log(bullet[b].time)
            }

            /*   let clearBullets = []
               bullets.forEach((bullet) => {
                   if (bullet.time < 100) {
                       clearBullets.push(bullet)
                   }
               })
   
               bullets = clearBullets*/

            if (player.fire === true) {
                player.counter++
                if (player.counter > player.loadingTime) {
                    shoot(player.rotation, {
                        x: player.position.x + Math.cos(player.rotation) * 20,
                        y: player.position.y + Math.sin(player.rotation) * 20
                    })
                    player.counter = 0
                }
            }


            //if player is dead, reload
            if (player.hp < 0) {
                location.reload()
            }
        }

    })


