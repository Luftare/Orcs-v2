import * as PIXI from 'pixi.js'
import keyboard from './keyboard'
import Vector from './Vector';


//https://github.com/kittykatattack/learningPixi

const app = new PIXI.Application({ width: 1000, height: 800 });

app.renderer.backgroundColor = 0x2b2a19;

document.body.appendChild(app.view);


app.loader
    .add('player', 'assets/player.png')
    .add('orc', 'assets/orc.png')
    .add('bullet', 'assets/projectile.png')
    .load((loader, resources) => {

        const player = new PIXI.Sprite(resources.player.texture);
        const orc = new PIXI.Sprite(resources.orc.texture);


        orc.x = 50;
        orc.y = 50;
        orc.hp = 1000;
        let orcPosition = new Vector(orc.x, orc.y);

        // Setup the player variables
        player.x = app.renderer.width / 2;
        player.y = app.renderer.height / 2;
        player.scale.x = 0.7;
        player.scale.y = 0.7;
        player.loadingTime = 10;
        player.counter = 0;
        player.vx = 0;
        player.vy = 0;
        player.rotate = 0;
        player.velocity = 0;
        player.fire = false;

        // Rotate around the center
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;

        //projectile
        var bullet = new PIXI.Sprite(resources.bullet.texture);
        var bulletTexture = new PIXI.Texture(resources.bullet.texture);
        bullet.x = player.x;
        bullet.y = player.y;
        var bullets = [];
        var bulletSpeed = 5;

        function orcSpawn() {

        }

        function shoot(rotation, startPosition) {
            var bullet = new PIXI.Sprite(bulletTexture);
            bullet.position.x = startPosition.x;
            bullet.position.y = startPosition.y;
            bullet.rotation = rotation;
            app.stage.addChild(bullet);
            bullets.push(bullet);
        }


        // Add the player to the scene we are building
        app.stage.addChild(player);
        app.stage.addChild(orc);

        // Listen for frame updates
        app.ticker.add(delta => gameLoop(delta));

        let state = play;


        //Capture the keyboard arrow keys
        let left = keyboard("ArrowLeft"),
            up = keyboard("ArrowUp"),
            right = keyboard("ArrowRight"),
            down = keyboard("ArrowDown"),
            leftCtrl = keyboard("Control")

        //Left arrow key `press` method
        left.press = () => {
            //Change the player's velocity when the key is pressed
            player.rotate -= 0.05
            player.vy = 0
        }

        //Left arrow key `release` method
        left.release = () => {
            //If the left arrow has been released, and the right arrow isn't down,
            //and the player isn't moving vertically:
            //Stop the player
            if (!right.isDown && player.vy === 0) {
                player.vx = 0
                player.rotate = 0
            }
        };

        //Up
        up.press = () => {
            player.vy = 0
            player.vx = 0
            player.velocity = 2
        };
        up.release = () => {
            if (!down.isDown && player.vx === 0) {
                player.vy = 0
                player.rotate = 0
                player.velocity = 0
            }
        };

        //Right
        right.press = () => {
            player.rotate += 0.05;

        };
        right.release = () => {
            if (!left.isDown && player.vy === 0) {
                player.vx = 0
                player.rotate = 0
            }
        };

        //Down
        down.press = () => {
            player.vy = 1
            player.vx = 0
        };
        down.release = () => {
            if (!up.isDown && player.vx === 0) {
                player.vy = 0
                player.rotate = 0
            }
        };

        //leftCtrl
        leftCtrl.press = () => {
            player.fire = true

        };
        leftCtrl.release = () => {
            player.fire = false
        };



        function gameLoop(delta) {
            //Update the player's velocity
            state(delta);
        }

        function play(delta) {

            player.x += player.velocity * Math.cos(player.rotation)


            player.y += player.velocity * Math.sin(player.rotation)

            player.rotation += player.rotate
                //console.log("x distance: " + player.toGlobal(player.position, orc).x)

            if (player.fire === true) {
                player.counter++
                    if (player.counter > player.loadingTime) {
                        shoot(player.rotation, {
                            x: player.position.x + Math.cos(player.rotation) * 20,
                            y: player.position.y + Math.sin(player.rotation) * 20
                        });
                        player.counter = 0
                    }

            }

            for (var b = bullets.length - 1; b >= 0; b--) {
                bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed
                bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed
                let bulletPosition = new Vector(bullets[b].position.x, bullets[b].position.y)
                if (bulletPosition.distance(orcPosition) < 100) {
                    console.log("Orc taking DMG")
                    orc.hp--
                }
            }

            //Check collision
            let playerPosition = new Vector(player.x, player.y)

            if (playerPosition.distance(orcPosition) < 100) {

                alert("ORc ATE YOU")

            }

            if (orc.hp < 0) {
                alert("ORC DIED YOU WIN!")
            }

        }

    });