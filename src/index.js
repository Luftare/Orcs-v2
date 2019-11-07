import * as PIXI from 'pixi.js'
import Vector from './Vector';
import Player from './Player'
import Orc from './Orc';

//https://github.com/kittykatattack/learningPixi

const app = new PIXI.Application({ width: 1000, height: 800 })

app.renderer.backgroundColor = 0x2b2a19

document.body.appendChild(app.view)

app.loader
    .add('player', 'assets/player.png')
    .add('orc', 'assets/orc1.png')
    .add('bullet', 'assets/projectile.png')
    .load((loader, resources) => {

        //initialize projectiles
        let bullets = []
        let bulletSpeed = 5

        //initialize player
        const playerStartX = app.renderer.width / 2
        const playerStartY = app.renderer.height / 2
        const player = new Player(playerStartX, playerStartY, resources, app, bullets)

        // Add the player to the scene we are building
        app.stage.addChild(player)

        //initialize array for updating orcs
        let orcs = []
        let orcsKilled = 0;

        //spawn some orcs
        setInterval(() => {
            let orc = new Orc(resources, app, orcs)
            orc.spawn()
            console.log("Orc spawned")
        }, 1000)

        // Listen for frame updates
        app.ticker.add(updateGameState)

        function updateGameState(delta) {
            //update player position
            player.x += player.velocity * Math.cos(player.rotation)
            player.y += player.velocity * Math.sin(player.rotation)

            //update player rotation    
            player.rotation += player.rotate
            let playerPosition = new Vector(player.x, player.y)

            //update orc position and check if alive
            for (let o = orcs.length - 1; o >= 0; o--) {
                orcs[o].position.x += orcs[o].speed
                orcs[o].position.y += orcs[o].speed

                let orcPosition = new Vector(orcs[o].position.x, orcs[o].position.y)
                if (orcPosition.distance(playerPosition) < 100) {
                    console.log("Player taking DMG")
                    player.hp--
                }

                //check orc / bullet collision
                for (let b = bullets.length - 1; b >= 0; b--) {
                    let bulletPosition = new Vector(bullets[b].position.x, bullets[b].position.y)
                    if (bulletPosition.distance(orcPosition) < 100) {
                        orcs[o].alive = false
                        app.stage.removeChild(orcs[o])
                        orcsKilled++
                        console.log("Orcs killed: " + orcsKilled)
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
            }

            if (player.fire === true) {
                player.shoot()
            }

            //if player is dead, reload
            if (player.hp < 0) {
                location.reload()
            }
        }

    })


