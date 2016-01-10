'use strict';
var fs = require('fs'),
Character = require('./character').character,
World = require('./world').world;

(function() {
	// wait-state removal
	setInterval(function() {
		var i = 0,
		player;
		
		if (World.players.length > 0) {
			for (i; i < World.players.length; i += 1) {
				player = World.players[i];

				if (player.position === 'sleeping' || 
					player.position === 'resting' || 
					player.position === 'standing') {
					
					if (player.wait > 0) {
						player.wait -= 1;
					} else {
						player.wait = 0;
					}
				}
			}
		}
	}, 1900);

	// Areas refresh when they are devoid of players for at least four minutes 
	setInterval(function() {
		var i = 0;

	}, 240000); // 4 minutes

	// AI Ticks for monsters
	setInterval(function() {
		var i = 0;
		if (World.areas.length) {
			for (i; i < World.areas.length; i += 1) {
				World.getAllMonstersFromArea(World.areas[i].name, function(monsters) {
					monsters.forEach(function(monster, i) {
						if (monster.chp >= 1 && monster.onAlive) {
							monster.onAlive();
						}
					});
				});
			}
		}
	//}, 1000); // 25 seconds
	}, 25000); // 25 seconds

	// AI Ticks for areas 
	setInterval(function() {
		var i = 0,
		s;

	}, 3600000); // 1 hour

	setInterval(function() {
		var i = 0;
		
		if (World.areas.length) {
			for (i; i < World.areas.length; i += 1) {
				if (World.areas[i].messages.length) {
					World.msgArea(World.areas[i].name, {
						msg: World.areas[i].messages[World.dice.roll(1, World.areas[i].messages.length) - 1].msg,
						randomPlayer: true // this options randomizes who hears the message
					});
				}
			}
		}
	}, 180000); // 3 minutes


	// Regen (Player only ATM);
	setInterval(function() { 
		var i = 0,
		player; 

		if (World.players.length > 0) {
			for (i; i < World.players.length; i += 1) {
				player = World.players[i];

				Character.hpRegen(player, function(player, addedHP) {
					Character.manaRegen(player, function(player, addedMana) {
						Character.mvRegen(player);
					});
				});
			}
		}
	}, 50000);

	// Hunger and Thirst Tick 
	setInterval(function() { 
		var i = 0,
		player; 

		if (World.players.length > 0) {
			for (i; i < World.players.length; i += 1) {
				player = World.players[i];

				Character.hunger(player, function(target) {
					Character.thirst(target);
				});
			}
		}
	}, 240000); // 4 minutes

	setInterval(function() {
		var s;

		if (World.players.length > 0) {
			fs.readFile('./templates/messages/motd.json', function (err, data) {
				var i = 0,
				alert = World.shuffle(JSON.parse(data).alerts)[0];

				for (i; i < World.players.length; i += 1) {
					World.msgPlayer(World.players[i], {
						msg: '<span><label class="red">Tip</label>: <span class="alertmsg"> ' 
							+ alert.replace(/@.*@/, World.players[i].displayName) + '</span></span>'
					});
				}
			});	
		}	
	}, 120000);


/*

	// Saving characters Tick
	setInterval(function() {
		var i = 0,
		s;
		
		if (players.length > 0) {
			for (i; i < players.length; i += 1) {
				s = io.sockets.connected[players[i].sid];
				
				if (s.position === 'sleeping' || 
					s.position === 'resting' || 
					s.position === 'standing') {			
					Character.save(s);			
				}							
			}
		}
	}, 60000 * 12);
	
*/

	// Time -- Increase minute, hours, days and years.
	// time data is saved to data/time.json every 12 hours
}());
