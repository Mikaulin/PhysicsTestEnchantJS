enchant();

/*Vars*/
var game, physicsWorld;

/*Dirs*/
var dImages = "images/";
var dMusic = "music/";

/*Sprites*/
var charMain = dImages + 'chara1.gif';
var mapGraphic = dImages + 'map2.gif';
var icon1 = dImages + 'icon1.png';

window.onload = function () {
	/*Inicializar objeto Game*/
	game = new Game(320, 320);	
	game.fps = 60;
	game.scale = 1;
	game.preload(charMain, icon1, mapGraphic);
	game.onload = function () {
		//Array con todas las bolas
		bolas = new Array();

		//Gravedad de 9.8
		//PhysicsWorld(gravityX, gravityY)
		physicsWorld = new PhysicsWorld(0, 9.8);

        for(var i = 0; i < 20; i++){
            //Generamos el suelo de 20 casillas
            //Con Objeto PhyBoxSprite
            //PhyBoxSprite(width, height, staticOrDynamic, density, friction, restitution, isSleeping)
            var floor = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);
            floor.image = game.assets[mapGraphic];
            //Número de Frame del Sprite
            floor.frame = 1;
            floor.position = { x: i*16, y: 300 };
            game.rootScene.addChild(floor);
        }

        //Listener en cada frame
        game.rootScene.addEventListener("enterframe", function () {
        	var randomnumber=Math.floor(Math.random()*11);
        	var randomDensity = Math.floor(Math.random()*5);

        	//Anvanzar simulacion física
            physicsWorld.step(game.fps);
            //Solo creamos bolas cuando el resto entre frame actual y fps == 0
            if(game.frame % game.fps == 0){

                var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, randomDensity, 0.5, 0.2, true);
                ball.image = game.assets[icon1];
                ball.frame = randomnumber;
                ball.position = { x: 0, y: 120 };
                ball.applyImpulse(new b2Vec2(Math.random(), 0));
                //Base 0
                bolas[bolas.length] = ball;

                ball.addEventListener("enterframe", function(){
                    if(bolas.length > 100) {                    		
                    		bolas[0].destroy();
                    		//Reagrupa el array pasando 
                    		//el indice en el primer parametro
                    		bolas.splice(0, 1);
                    		//console.log("destroy");
                    	}
					//Explotar cada vez que 2 bolas chocan
					for (var i in bolas) {
						//console.log(i);
						if(ball.intersect(bolas[i]) && bolas[i] != ball) {
							/*this.destroy();
							bolas[i].destroy();
		                    bolas.splice(i, 1);
		                    game.rootScene.removeChild(this);
		                    game.rootScene.removeChild(bolas[i]);*/
		                    //Pruebas: Aplicar fuerza cuando se toquen
		                    this.applyImpulse(new b2Vec2(Math.random(), Math.random()));
		                    bolas[i].applyImpulse(new b2Vec2(Math.random(), -1));
                    		break;
	                    	
		                    //console.log(bolas.length);
		                }
					}
                });
				game.rootScene.addChild(ball);


                //Explotar cada vez que 2 bolas chocan
            	
            }

        });


	};
	game.start();
};