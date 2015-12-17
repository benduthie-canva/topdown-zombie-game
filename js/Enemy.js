var UP = 4;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var Enemy = function(x, y)
{
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.direction = UP;
	
	this.pause = 0;
	
	this.width = 16;
	this.height = 16;
	
	this.image = document.createElement("img");
	this.image.src ="enemy.png";
	
	this.velocity = new Vector2(0,0);
	this.speed = 1;
}

Enemy.prototype.update = function(deltaTime)
{
	var ddx = 0; // acceleration
	var ddy = 0; // was GRAVITY to simulate going down

	// calculate the new position and velocity:
	
	

	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	
	
	var cell = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty);
	
	var cellright = cellAtTileCoord(LAYER_ENEMY_PATHING, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty + 1);
	var cellleft = cellAtTileCoord(LAYER_ENEMY_PATHING, tx - 1, ty);
	var cellup = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty - 1);
	

	
	
	
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:

	if ((!celldown && cell)) 
	{
		this.position.y = tileToPixel(ty);
		this.velocity.y = 0; // stop downward velocity
		this.down = 0;
	}
	else
		this.down = 1;


	if ((!cellup && cell)) 
	{
		// clamp the y position to avoid jumping into platform above
		this.position.y = tileToPixel(ty + 1);
		this.velocity.y = 0; // stop upward velocity
		this.up = 0;
	}
	else
		this.up = 1;

	if ((!cellright && cell)) 
	{
		// clamp the x position to avoid moving into the platform we just hit
		this.position.x = tileToPixel(tx);
		this.velocity.x = 0; // stop horizontal velocity
		this.right = 0;
	}
	else
		this.right = 1;


	if ((!cellleft && cell)) 
	{
		// clamp the x position to avoid moving into the platform we just hit
		this.position.x = tileToPixel(tx + 1);
		this.velocity.x = 0; // stop horizontal velocity
		this.left = 0;
	}
	else
		this.left = 1;
	
	this.totalPaths = this.up + this.down + this.left + this.right;
	
	switch(this.direction)
	{
	case UP:
		if (cellup && !cellleft && !cellright)
		{
			this.position.y -= 1;
		}
		else
			this.chooseDirection();
	break;
	
	case LEFT:
		if (cellleft && !cellup && !celldown)
		{
			this.position.x -= 1;
		}
		else
			this.chooseDirection();
	break;
	
	case DOWN:
		if (celldown && !cellleft && !cellright)
		{
			this.position.y += 1;
		}
		else
			this.chooseDirection();
	break;
	
	case RIGHT:
		if (cellright && !cellup && !celldown)
		{
			this.position.x += 1;
		}
		else
			this.chooseDirection();
	break;
	
	default:
		this.chooseDirection();
	break;
	}
	
	
	//this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	//this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Enemy.prototype.chooseDirection = function()
{		
	this.direction = Math.floor((Math.random() * 4) + 1);
}

Enemy.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x - camera.worldOffsetX - this.width/2, this.position.y - camera.worldOffsetY - this.height/2)

}