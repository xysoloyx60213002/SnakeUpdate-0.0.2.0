$( function() {

    var Vector = function( positionX , positionY ) {

        this.x = positionX

        this.y = positionY 

    }

    Vector.prototype.addition = function( addValue ) {

        return new Vector( this.x + addValue.x , this.y + addValue.y )

    }

    Vector.prototype.equal = function( equalValue ) {

        return this.x == equalValue.x && this.y == equalValue.y

    }

    Vector.prototype.multiplication = function( mulValue ) {

        return new Vector( this.x * mulValue , this.y * mulValue )

    }

    var Snake = function() {

        this.body = []

        this.maxLength = 5

        this.blockCount = guiControl.MaxBlock

        this.direction = [  new Vector( 1 , 0 ) , new Vector( -1 , 0 ) , new Vector( 0 , 1 ) , new Vector( 0 , -1 ) ]

        this.head = new Vector( parseInt( Math.random() * this.blockCount * 0.75 ) , parseInt( Math.random() * this.blockCount * 0.75 ) )

        this.speed = this.direction[ parseInt( Math.random() * this.direction.length ) ]

    }

    Snake.prototype.update = function() {

        let newHead = this.head.addition( this.speed )

        this.body.push( this.head )

        this.head = newHead

        while ( this.body.length > this.maxLength ) {

            this.body.shift()

        }

    }  

    var Game = function() {

        this.blockWidth = 10

        this.blockCenter = 10

        this.speed = 0

        this.snake = new Snake()

        this.blockCount = this.snake.blockCount  

        this.foods = []

        this.foodValue = 0

        this.foodMany = 2

        // this.foodMany = guiControl.foodMany
        
        // this.foodColorRandom = this.randomColor()

        this.foodColorRandom = [ 'red' , 'orange' , 'yellow' , 'SpringGreen' , 'skyblue' , 'white' ]

        this.newFoodColorRandom = this.foodColorRandom[ parseInt( Math.random() * ( this.foodColorRandom.length - 1 ) ) ]

        this.gameStartOrEnd = false

    }

    // Game.prototype.checkBoundary = function( blockCount ) {
    
    //         let rangeX = -2 < this.snake.head.x && blockCount + 1 > this.snake.head.x
    
    //         let rangeY = -2 < this.snake.head.y && blockCount + 1 > this.snake.head.y
    
    //         return rangeX && rangeY
    
    //     }

    Game.prototype.setDirection = function( direction ) {

            var target

            if ( direction == 'ArrowUp' ) {

                // target = new Vector( 0 , -1 )

                target = new Vector( 0 , guiControl.vectorUp )

            }

            if ( direction == 'ArrowDown' ) {

                // target = new Vector( 0 , 1 )

                target = new Vector( 0 , guiControl.vectorDown )           

            }

            if ( direction == 'ArrowLeft' ) {

                target = new Vector( -1 , 0 )

                target = new Vector( guiControl.vectorLeft , 0 )           

            }

            if ( direction == 'ArrowRight' ) {

                target = new Vector( 1 , 0 )

                target = new Vector( guiControl.vectorRight , 0 )           

            }

            if ( !guiControl.CanTurn ) {

                if ( target.equal( this.snake.speed.multiplication( -1 ) ) == false ) {

                    this.snake.speed = target            

                }

            } else {

                this.snake.speed = target            

            }          

        }

    // Game.prototype.randomColor = function() {

    //     var r = Math.floor( Math.random() * 256 )

    //     var g = Math.floor( Math.random() * 256 )

    //     var b = Math.floor( Math.random() * 256 )

    //     return "rgb(" + r + "," + g + "," + b + ")"

    // }

    Game.prototype.startGame = function() {

        this.gameStartOrEnd = true

        $( '.panelOne' ).hide()

        $( '.panelTwo' ).show().text( '0' )

        $( '.panelThree' ).hide()
        
        this.snake = new Snake()

        this.foodValue = 0

        this.playSound( "C#5" , -20 )

        this.playSound( "E5" , -20 , 200 )

    }

    Game.prototype.endGame = function() {

        this.gameStartOrEnd = false
        
        $( '.panelOne' ).show()

        $( '.panelTwo' ).hide()

        $( '.panelThree' ).show().text( '你的分數 ( Score ) :' + '   ' + ( this.foodValue * 10 * guiControl.countPoint ) )

        $( '.panelFour' ).hide()

        $( '.btnIll' ).show()
        
        $( '.btnIll' ).css( 'bottom' , '15%' )

        this.playSound( "A3" )

        this.playSound( "E2" , -10 , 200 )

        this.playSound( "A2" , -10 , 400 )

        this.foods = []

        this.foodMany = 2

        // this.foodColorRandom = this.randomColor()

        this.newFoodColorRandom = this.foodColorRandom[ parseInt( Math.random() * ( this.foodColorRandom.length - 1 ) ) ]

        this.generateFood()

    }

    Game.prototype.init = function() {

        this.canvas = document.getElementById( 'mycanvas' )

        this.canvas.width = this.blockWidth * this.blockCount + this.blockCenter * ( this.blockCount - 1 ) ;

        this.canvas.height = this.canvas.width    
        
        this.cvs = this.canvas.getContext( '2d' );

        this.render()

        this.update()

        this.generateFood()

    }

    Game.prototype.drawEffect = function( valueX , valueY ) {

        radius = 2

        let position = this.getBlock( valueX , valueY )

        var _this = this

        let effect = function() {

            radius++

            // _this.cvs.strokeStyle = "rgba( " + _this.foodColorRandom + " , " + ( 100 / radius ) * 100 + " ) "

            // _this.cvs.strokeStyle = _this.foodColorRandom

            _this.cvs.strokeStyle = _this.newFoodColorRandom

            _this.cvs.beginPath()

            _this.cvs.arc( position.x + _this.blockWidth / 2 , position.y + _this.blockWidth / 2 , 20 * Math.log( radius / 2 ) , 0 , Math.PI * 2 )

            _this.cvs.stroke()

            if ( radius <= 100 ) {

                requestAnimationFrame( effect )

            }
            
        }

        requestAnimationFrame( effect )

    }

    Game.prototype.generateFood = function() {

        var x = parseInt( Math.random() * this.blockCount ) 

        var y = parseInt( Math.random() * this.blockCount )

        this.foods.push( new Vector( x , y ) );

        this.drawEffect( x , y )

        this.playSound( 'E5' , -20 )

        this.playSound( 'A5' , -20 , 200 )



    }

    Game.prototype.getBlock = function( valueX , valueY ) {

        return new Vector( 

            this.blockWidth * valueX + this.blockCenter * valueX , 

            this.blockWidth * valueY + this.blockCenter * valueY

        )

    } 

    Game.prototype.drawBlock = function( value , color ) {

        this.cvs.fillStyle = color

        var position = this.getBlock( value.x , value.y )

        this.cvs.beginPath()
        
        var circle = this.blockWidth / 2

        this.cvs.arc( position.x + circle , position.y + circle , circle  , 0 , Math.PI * 2 )

        this.cvs.fill()

    }

    Game.prototype.render = function() {

        this.cvs.fillStyle = '#222'

        this.cvs.fillRect( 0 , 0 , this.canvas.width , this.canvas.height )

        for ( var initX = 0; initX < this.blockCount; initX++ ) {

            for ( var initY = 0; initY < this.blockCount; initY++ ) {

                this.drawBlock( new Vector( initX , initY ) , 'rgba( 0 , 0 , 0 , .5 )' )

            }

        }

        // ---------------------------------------------------------------------------------
        this.snake.body.forEach( ( result , index ) => {

            // this.drawBlock( result , this.foodColorRandom )
            this.drawBlock( result , guiControl.SnakeColor )

        } )
        // ---------------------------------------------------------------------------------
        this.foods.forEach( ( foodResult ) => {

            // this.drawBlock( foodResult , this.foodColorRandom )

            this.drawBlock( foodResult , this.newFoodColorRandom )


        } )
        // ---------------------------------------------------------------------------------

        requestAnimationFrame( () => this.render() )

    }

    Game.prototype.update = function() {  

        if ( guiControl.PauseGameK ) {

            if ( this.gameStartOrEnd ) {

                this.playSound( 'A2' , -20 )

                this.snake.update()

                // --------------------------------------------------------------------------------
                this.foods.forEach( ( food , index ) => {   

                if ( this.snake.head.equal( food ) ) {           

                    this.snake.maxLength += 1

                    this.foods.splice( index , 1 )

                    if ( this.foods.length == 0 ) {

                        for ( var init = 0; init < this.foodMany; init++ ){

                            this.generateFood()     

                            // this.foodColorRandom = this.randomColor()
                            this.newFoodColorRandom = this.foodColorRandom[ parseInt( Math.random() * ( this.foodColorRandom.length - 1 ) ) ]

                        }

                        // this.foodMany++

                        this.foodMany += guiControl.foodMany

                    }

                    this.newFoodColorRandom = this.foodColorRandom[ parseInt( Math.random() * ( this.foodColorRandom.length - 1 ) ) ]
                    
                    // ------------------------------------------------------   

                    this.foodValue = this.foodValue + 1

                    $( '.panelTwo' ).text( this.foodValue * 10 * guiControl.countPoint )

                }

                this.snake.body.forEach( ( bodyValue ) => {

                    if ( !guiControl.NoDie ) {

                        if ( bodyValue.equal( this.snake.head ) ) {

                            this.endGame()

                        }

                    }             

                } )

            } )

        }

            // -------------------------------------------------------------------------------

            // if ( this.checkBoundary( this.blockCount ) == false ) {

            //     this.endGame();

            // }

            if ( this.snake.head.x < 0 ) {

                this.snake.head.x = this.blockCount - 1

            }

            if ( this.snake.head.x > this.blockCount - 1 ) {

                this.snake.head.x = 0

            }

            if ( this.snake.head.y < 0 ) {

                this.snake.head.y = this.blockCount - 1

            }

            if ( this.snake.head.y > this.blockCount - 1 ) {

                this.snake.head.y = 0 

            }

        }    

        this.speed = Math.sqrt( this.snake.body.length ) + guiControl.SnakeVelocity

        setTimeout( () => {

            this.update()

        } , parseInt( 1000 / this.speed ) )   

    }  

    // -----------------------------------------------------------------------------------------------------------------------------------
    // 音符
    Game.prototype.playSound = function( note , volume , when ){

        setTimeout( () => {

          var synth = new Tone.Synth().toMaster();  

          synth.volume.value = volume || -12;

          synth.triggerAttackRelease( note, "8n" );

        } , when || 0 )
      }
    // ----------------------------------------------------------------------------------------------------------------------------------- 

    var guiControl = {

        vectorUp: -1,

        vectorDown: 1,

        vectorLeft: -1,

        vectorRight: 1,

        SnakeVelocity: 10,

        SnakeColor: '#ffffff',

        countPoint: 1,

        foodMany: 1,

        NoDie: false,

        CanTurn: false,

        MaxBlock: 40,

        PauseGameK: true
        // pause: function() {}

    }

    var gui = new dat.GUI();

    // gui.add( guiControl , 'pause' ).onChange( function() {} )

    var game = new Game()

    game.init()

    var totalBlock = Math.pow( game.snake.blockCount , 2 )

    console.log( totalBlock );

    gui.add( guiControl , 'vectorUp' , -10 , -1 ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'vectorDown' , 1 , 10 ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'vectorLeft' , -10 , -1 ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'vectorRight' , 1 , 10 ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'SnakeVelocity' , 0 , 10000 ).step( 1 ).onChange( function() {} )

    gui.addColor( guiControl , 'SnakeColor' )

    gui.add( guiControl , 'countPoint' , 0 , 1000000000000000000 ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'foodMany' , 0 , totalBlock ).step( 1 ).onChange( function() {} )

    gui.add( guiControl , 'NoDie' )

    gui.add( guiControl , 'CanTurn' )

    gui.add( guiControl , 'MaxBlock' , 0 , 100 ).step( 1 )

    gui.add( guiControl , 'PauseGameK' ).listen()

    $( '.dg' ).hide()

    $( '.pauseGame' ).hide()

    $( '.countDown' ).hide()   

    $( '.btnRun' ).hide()

    $( '.panelTalk' ).hide()
    
    $( window ).keydown( function( event ) {

        // game.setDirection( event.key.replace( "Arrow" , "" ) )

        if ( game.gameStartOrEnd ) {

            if ( event.keyCode == 27 ) {

                guiControl.PauseGameK = false

                $( '.pauseGame' ).show()
                
                $( '.btnIll' ).show().css( 'bottom' , '42.5%' )

                $( '.btnRun' ).show()

            }

            if ( event.keyCode == 75 ) {

                $( '.dg' ).toggle()

            }

        }

        game.setDirection( event.key )

    } )

    $( '.btn' ).click( function() {     

        game.startGame()

        $( '.btnIll' ).hide().css( 'bottom' , '42.5%' )

        $( '.btnRun' ).hide()

        $( '.btnPause' ).click( function() {

            $( '.btnIll' ).hide().css( 'bottom' , '42.5%' )

            $( '.btnRun' ).hide()

            var time = 3

            var timer = setInterval( function() {

                $( '.countDown' ).show().text( time )    

                if ( time == 0 ) {

                    clearInterval( timer )

                    $( '.countDown' ).hide()

                    guiControl.PauseGameK = true

                }
        
                $( '.pauseGame' ).hide()    

                $( '.btnIll' ).hide().css( 'bottom' , '42.5%' )

                $( '.btnRun' ).hide().css( 'bottom' , '37.5%' )

                time = time - 1

                game.playSound( 'A5' , -15 , 150 )

            } , 1000 )

            $( '.pauseGame' ).hide()

        } )

    } )

    $( '.btnIll' ).click( function() {

        $( '.panelTalk' ).show()

        $( '.panelOne' ).css( 'opacity' , '0.75' )

        $( '.pauseGame' ).css( 'opacity' , '0.75' )

    } )

    $( '.panelTalk>img' ).click( function() {

        $( '.panelTalk' ).hide()

        $( '.panelOne' ).css( 'opacity' , '1' )

        $( '.pauseGame' ).css( 'opacity' , '1' )

    } )

    // $( '.btnRun' ).click( function() {

    //     game.endGame()

    //     $( '.btnRun' ).hide()

    //     $( '.btnIll' ).css( 'bottom' , '15%' )

    //     $( '.panelOne' ).show()

    //     $( '.pauseGame' ).hide()

    //     $( '.panelThree' ).show().text( '你的分數 ( Score ) :' + '   ' + ( game.foodValue * 10 * guiControl.countPoint ) )

    // } )

    

} )
