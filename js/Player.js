var Player = function() 
{
	this.width = 30;
	this.height = 30;
	
	this.position = new Vector2(0, 0);
	this.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
	
	this.center = new Vector2(0,0);
	
	this.velocity = new Vector2(0, 5);
	
	this.rotation = 0;
	
	this.image = document.createElement("img");
	this.image.src ="player.png";
}
	
	
Player.prototype.update = function(deltaTime)
{	
	this.center.set(this.position.x - this.width/4, this.position.y - this.height/ 1.33333333333)
	
	this.animations(deltaTime);
	this.movement(deltaTime);
}


Player.prototype.animations = function(deltaTime)
{	
	
}


Player.prototype.movement = function(deltaTime)
{
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	
	
	
	
	if (keyboard.isKeyDown(keyboard.KEY_UP) == true)
	{
		this.up = true;
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_DOWN) == true)
	{
		this.down = true;
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		this.right = true;
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		this.left = true;
	}
	
	
	
	
	// player is always going right in our game.
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var wasup = this.velocity.y < 0;
	var wasdown = this.velocity.y > 0;
	
	var ddx = 0; // acceleration
	var ddy = 0; // was GRAVITY to simulate going down

	if (this.left) // if player is trying to go left
	ddx = ddx - ACCEL; // speed up player/ accelerate
	else if (wasleft)
	ddx = ddx + FRICTION; // slow down player/ decellerate

	if (this.right)
	ddx = ddx + ACCEL; // player wants to go right
	else if (wasright)
	ddx = ddx - FRICTION; // player was going right, but not any more

	if (this.up)
	ddy = ddy - ACCEL; // player wants to go up
	else if (wasup)
	ddy = ddy + FRICTION; // player was going up, but not any more

	if (this.down)
	ddy = ddy + ACCEL; // player wants to go down
	else if (wasdown)
	ddy = ddy - FRICTION; // player was going down, but not any more


	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX * this.speed, MAXDX * this.speed);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY * this.speed, MAXDY * this.speed);
	
	this.collisionDetection();
	
	if ((wasleft && (this.velocity.x > 0)) || (wasright && (this.velocity.x < 0)))
	{
		// clamp at zero to prevent friction from making us jiggle side to side
		this.velocity.x = 0;
	}
	
	if ((wasup && (this.velocity.y > 0)) || (wasdown && (this.velocity.y < 0)))
	{
		// clamp at zero to prevent friction from making us jiggle side to side
		this.velocity.y = 0;
	}
	
	//this.cheats();
}



Player.prototype.collisionDetection = function()
{
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cellleft = cellAtTileCoord(LAYER_PLATFORMS, tx - 1, ty);
	var cellup = cellAtTileCoord(LAYER_PLATFORMS, tx, ty - 1);
	

	
	
	
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	if (this.velocity.y > 0) 
	{
		if ((celldown && !cell)) 
		{
			// clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; // stop downward velocity
			this.falling = false; // no longer falling
			this.jumping = false; // (or jumping)
			ny = 0; // no longer overlaps the cells below
		}
	}
	
	else if (this.velocity.y < 0) 
	{
		if ((cell && !celldown)) 
		{
			// clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0; // stop upward velocity
			// player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			ny = 0; // player no longer overlaps the cells below
		}
	}

	if (this.velocity.x > 0) 
	{
		if ((cellright && !cell)) 
		{
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; // stop horizontal velocity
			
			
		}
	}
	else if (this.velocity.x < 0) 
	{
		if ((cell && !cellright)) 
		{
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
	
	
	/*if(cellAtTileCoord(LAYER_OBJECT_TRIGGERS, tx, ty) == true && !this.dead)
	{
		this.kill();
	}*/
}
Player.prototype.kill = function()
{
	if (!this.dead)
	{
		if (this.timer < 0)
			this.timer = 2;
		sfxDeath.play();
		this.velocity.x = 0;
		this.jumping = false;
		this.falling = true;
		this.dead = true;
		this.playerState = DEAD;
		if (this.sprite.currentAnimation != ANIM_DEATH_RIGHT)
		{
			this.sprite.setAnimation(ANIM_DEATH_RIGHT);
		}
	}
}

Player.prototype.draw = function()
{
	context.drawImage(this.image, this.center.x - camera.worldOffsetX, this.center.y - camera.worldOffsetY)
}

Player.prototype.cheats = function()
{
	// Hacks and "Checkpoints"
	if (keyboard.isKeyDown(keyboard.KEY_0) == true)
	{
		this.position.y = -200;
	}
	if (keyboard.isKeyDown(keyboard.KEY_1) == true)
	{
		//"Put a breakpoint here to freeze the game at will"
		var freezethegamehere = 1;
	}
	if (keyboard.isKeyDown(keyboard.KEY_2) == true)
	{
		this.position.y = 432;
		this.position.x = 5280;
		camera.origin.x = 5296 - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_3) == true)
	{
		this.position.y = 432;
		this.position.x = 7834;
		camera.origin.x = 7834 - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_4) == true)
	{
		this.position.y = 432;
		this.position.x = 8600;
		camera.origin.x = 8600 - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_5) == true)
	{
		
		this.position.y = 336;
		this.position.x = 10736;
		camera.origin.x = this.position.x - 500;
	}
	
	// hack to shortcut to end of level
	if (keyboard.isKeyDown(keyboard.KEY_6) == true)
	{
		this.position.y = 400;
		this.position.x = 12000;
		camera.origin.x = this.position.x - 500;
		//this.playerState = POGOSTICK;
		//this.timer = 0.24;
	}
	if (keyboard.isKeyDown(keyboard.KEY_7) == true)
	{
		this.position.y = 400;
		this.position.x = 12000;
		camera.origin.x = this.position.x - 500;
	}
	if (keyboard.isKeyDown(keyboard.KEY_8) == true)
	{
		this.timer = 5;
		this.playerState = LESS_GRAVITY;
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_9) == true)
	{
		this.kill();

	}
}