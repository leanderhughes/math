
				var deleteLocalStorage = function(){
					delete localStorage;
				}
				addEventListener("contextmenu", function(e){
					e.preventDefault();
				});
				var o = {};
				o.score = 0;
				var commonMathOperators = '+-x÷';
				var jsMathOperators = '+-*/';			
				o.userSettings = {
					
					Math: '+',
					Numbers: 5,
					Speed: 0,
					Volume: 1,
					Speeds: {
						Slow: 0,
						Medium: 2,
						Fast: 4,
						Ludicrous: 10				
					},
					Numberss: {
						Small: 5,//max sum product etc
						Medium: 9,
						Large: 100,
						Ludicrous: 1000
					},
					Maths: {
						Add: '+',
						Subtract: '-',
						Multiply: '*',
						Divide: '/'
					},
					Volumes: {
						High: 1,
						Mute: 0,
						Low: .3,
						Medium: .6
					}
				}
				o.nextScore = 0;
				var getNextScore = function(o){
					return (jsMathOperators.indexOf(o.userSettings.Math)+2) * (o.userSettings.Speed+2) * (o.userSettings.Numbers+2);
				}
				var no = function(value){
					return !value && value !== 0;
				}
				var is = function(value){
					return !no(value);
				}
				var getKeyAtVal = function(object,val){
					var key = '';
					for(key in object){
						if(object[key] == val){
							return key;
						}
					}
					return key;
				}
				var getKeyAfterVal = function(object,val){
					var foundKey = '';
					var prevKey = getKeyAtVal(object,val);
					var stop = false;
					for(var key in object){
						if(typeof object[key] == 'object'){
							continue;
						}
						if(stop){
							foundKey = key;
							break;
						}
						if(key == prevKey){
							stop = true;
						}
					}
					if(!foundKey){
						for(var key in object){
							foundKey = key;
							break;
						}
					}
					return foundKey;
				}
				var isNum = function(val){
					if(no(val)){
						return false;
					}
					for(var i = 0; i < val.length; val++){
						if(no(val[i])){
							return false;
						}
						if(('0123456789.').indexOf(val[i]) == -1){
							return false;
						}
					}
					return true;
				}
				var fromStorage = function(name){
					if(localStorage){
						if(localStorage[name]){
							var val = localStorage.getItem(name);
							if(val == 'undefined'){
								return '';
							}
							if(val[0] == '[' || val[0] == '{'){
								val = JSON.parse(val);
							}
							else if(isNum(val)){
								val = parseFloat(val);
							}
							return val;
						}
					}
					return '';
				}
				var toStorage = function(name,val){
					if(typeof val == 'object'){
						val = JSON.stringify(val);
					}
					if(localStorage){
						localStorage.setItem(name,val);
					}					
				}
				var upper = function(string){
					return string.slice(0,1).toUpperCase() + string.slice(1);
				}
				var isOb = function(val){
					return typeof val == 'object'; 
				}
				var changeSettings = function(button,notNext){		
					var name = button.id;
					var html = '';
					if(notNext){
						html = getKeyAtVal(o.userSettings[name+'s'],o.userSettings[name]);
					}
					else{
						html = getKeyAfterVal(o.userSettings[name + 's'],o.userSettings[name]);
					}
					o.userSettings[name] = o.userSettings[name+'s'][html];
					toStorage(name,o.userSettings[name]);
					
					button.innerHTML = name+': '+html;
					o.settingChanges = o.settingChanges || {};
					o.settingChanges[name] = o.userSettings[name];
				}

				var getUserSettings = function(){
					for(var key in o.userSettings){
						if(isOb(o.userSettings[key])){
							continue;
						}
						var val = fromStorage(key);
						if(is(val)){
							o.userSettings[key] = val;			
							changeSettings(document.getElementById(key),'notNext');
						}	
					}
				}
				getUserSettings();


				var updateInterval = 10;
				var relative = 'relative';
				var hidden = 'hidden';
				var absolute = 'absolute';
				var block = 'block';

				var round = function(num,place){
					place = place || 0;
					place = Math.pow(10,place);
					return Math.round(num * place)/place;
				}
				var getDims = function(element,prop,value){
					if(('width,height,left,top,zIndex').indexOf(prop) > -1){
						element[prop] = value;
						return element;
					}
					return element;
				}
				var addPx = function(value,prop){
					if(('width,height,left,top').indexOf(prop) > -1){
						return value + 'px';
					}
					return value;
				}
				var loadSound = function(element){

					if(!element.sound){
						return element;
					}
					if(!o.sounds){
						o.sounds = {};
					}
					if(!o.sounds[element.sound]){
						o.sounds[element.sound] = new Audio(element.sound);
					}
					element.volume = is(element.volume) ? element.volume : 1;
					if(is(element.volume)){
						o.sounds[element.sound].volume = element.volume;
						o.sounds[element.sound].volumeOriginal = o.sounds[element.sound].volume;
						o.sounds[element.sound].volume = o.sounds[element.sound].volumeOriginal * o.userSettings.Volume;
					}
					if(element.currentTime){
						o.sounds[element.sound].startHere = element.currentTime;
					}
					element.playSound = function(){

						o.sounds[element.sound].currentTime = 0;

						if(o.sounds[element.sound].startHere){
							o.sounds[element.sound].currentTime = o.sounds[element.sound].startHere;
						}
						if(element.loop){
							o.sounds[element.sound].loop = true;
						}
						o.sounds[element.sound].play();
					}
					element.stop = function(){
						o.sounds[element.sound].currentTime = 0;
						o.sounds[element.sound].pause();
					}
					return element;
				}
				var assignProperties = function(element,props){
					element.props = props;
					for(var key in props){
						if(key == 'props'){
							continue;
						}
						if(typeof props[key] == 'object'){
							if(key == 'listen'){
								for(var key2 in props[key]){
									element.addEventListener(key2,props[key][key2]);
								}
								continue;
							}
							if(('dis,move').indexOf(key) > -1){
								if(no(element[key])){
									element[key] = {};
								}		
								for(var key2 in props[key]){
									element[key][key2] = props[key][key2];
								}
								continue;
							}
							if(no(element[key])){
								element[key] = {};
							}					
							for(var key2 in props[key]){
								element = getDims(element,key2,props[key][key2]);
								element[key][key2] = addPx(props[key][key2],key2);
							}
							if(key == 'style'){
								if(no(element.style.zIndex)){
									element.style.zIndex = 0;
								}
							}

						}
						else{
							element[key] = addPx(props[key],key);
						}
					}


					element = loadSound(element);
					return element;
				}
				var createElement = function(type,props){
					var element = document.createElement(type);
					element = assignProperties(element,props);
					return element;
				}
				var append = function(parent,child){
					return parent.appendChild(child);
				
				}
				var setPosition = function(element){
					element.originalLeft = element.originalLeft || element.left;
					element.originalTop = element.originalTop || element.top;
					element.waitOriginal = element.waitOriginal || element.wait || 0;
					return element;
				}
				var updateRight = function(element){
					element.right = element.left + element.width;
					return element;
				}
				var updateBottom = function(element){
					element.bottom = element.top + element.height;
					return element;
				}
				var updateDims = function(element){
					element = updateRight(element);
					element = updateBottom(element);
					return element;
				}
				var checkIfOff = function(o,element){
					element = updateRight(element);
					element = updateBottom(element);
					var offScreen = element.right < o.game_screen.left ||
									element.bottom < o.game_screen.top ||
									element.left > o.game_screen.right ||
									element.top > o.game_screen.bottom;
					if(offScreen){
						element.off = true;
					}
					return element;
				}

				var generateMovements = function(o){
					o.line = function(element){
						element = addDis(element);
						element.style.left = element.left + 'px';
						element.style.top = element.top + 'px';
						element = checkIfOff(o,element);
						return element;
					}
					return o;
				}
				o = generateMovements(o);

				var generateGameScreen = function(o){
					o.game_border = createElement('div',{
							id: 'game_border',
							shakeTill: 90,
							move: {
								top: o.line,
								left: o.line
							},
							dis: {
								top: 0,
								left: 0
							},
							style:{
								position: absolute,
					
								top: 20,
								left: 20,
								padding: 0,
								width: 1200,
								height: 600,
								overflow: hidden,
								zIndex: 10
							}
						}
					);

					o.game_screen = createElement('div',{
							id: 'game_screen',

							style:{
								position: absolute,
								top: 0,
								left: 0,
								backgroundColor: 'rgba(256,256,256,0)',
								width: o.game_border.width,
								height: o.game_border.height,
								display: block,
							
							}
						}
					);
					o.game_mask = createElement('div',o.game_screen.props);
					o.game_mask = assignProperties(o.game_mask,{
						style: {
							//backgroundColor: 'black',
							backgroundImage: 'url("background_0.png")',
							left: -5,
							top: -5,
							width: o.game_border.width + 5,
							height: o.game_border.height + 5,
							zIndex: 9
						}
					});
					o.game_mask = setPosition(o.game_mask);
					o.game_border = setPosition(o.game_border);
					append(o.game_border,o.game_mask);
					append(o.game_mask,o.game_screen);
					append(document.body,o.game_border);
					return o;
					
				}
				o = generateGameScreen(o);
				var generateBackground = function(o){
					o.game_backgrounds = [];
					o.background_masks = [];
					for(var l = 1; l > -1; l--){
						o.game_backgrounds[l] = o.game_backgrounds[l] || [];
						for(var b = 0; b < 2; b++){

							o.game_backgrounds[l][b] = createElement('div',o.game_screen.props);
							var thisLeft = (-12/((l+1)*12)) * (1*(o.userSettings.Speed+1));
							if(b > 0){
								thisLeft = 0;
							}
							o.game_backgrounds[l][b] = assignProperties(o.game_backgrounds[l][b],{
								id: 'background_'+l+'_'+b,

								move: {
					
									top: o.line,
									left: o.line
								},
								dis:{
									top: 0,
									left: thisLeft,
									originalLeft: thisLeft
								},
								style: {
									left: b * (o.game_screen.width-2),
									top: 0,
									background: 'url("background_'+(l+1)+'.png")',
									marginTop: '5px',
									marginLeft:'5px',
									padding: 0

								}
							});
							append(o.game_screen,o.game_backgrounds[l][b]);				
				
						}
						
					
						o.background_masks[l] = createElement('div',o.game_screen.props);
						o.background_masks[l] = assignProperties(o.background_masks[l],{
							id: 'masks_'+l,
							style: {
								opacity: .5 / (l+1),
								backgroundColor: 'rgb(60,120,200)',
								marginTop: '5px',
								marginLeft: '5px',
								//display: 'none'
							}
						});
						append(o.game_screen,o.background_masks[l]);

					}
					return o;
				}
				o = generateBackground(o);

				var preventDefault = function(event){
					return event.preventDefault();
				}
				addEventListener('touchstart',preventDefault,{passive:false});
				var generateListeners = function(o){
					o.carry = function(mousedown){
						element = this;
						if(element.destroyed){

							return;
						}
						element.style.zIndex = 2;
						element.height = element.height;
						element.width = element.width;
						var reposition = function(e){
							e.preventDefault();
							if(element.destroyed){
								return;
							}
							if(e.touches){
								e = e.touches[0];
							}
							element.left = 	Math.round(e.pageX - element.width/2);
							element.top = Math.round(e.pageY - element.height/2);			
							element.style.left = element.left + 'px';
							element.style.top =  element.top + 'px';
						}
						addEventListener('mousemove',reposition);
						addEventListener('touchmove',reposition,{passive:false});
						var release = function(){
							if(element.destroyed){
								return;
							}
							element.style.zIndex = element.zIndex;
							removeEventListener('touchmove',reposition);
							removeEventListener('mousemove',reposition);
							removeEventListener('touchend',release);
							removeEventListener('mouseup',release);
						}
						addEventListener('touchend',release);
						addEventListener('mouseup',release);
					}
					return o;
				}
				o = generateListeners(o);
		
				o.game_screen = updateDims(o.game_screen);

		
				var abs = function(num){
					return Math.abs(num);
				}
				var addDis = function(element){
					element.dis.tempLeft = element.dis.tempLeft || 0;
					element.dis.tempTop = element.dis.tempTop || 0;
					element.dis.tempLeft += element.dis.left;
					element.dis.tempTop += element.dis.top;		
					if(abs(element.dis.tempLeft) >= 1){
						element.left+= round(element.dis.tempLeft);
						element.dis.tempLeft = 0;
					}
					if(abs(element.dis.tempTop) >= 1){
						element.top+= round(element.dis.tempTop);
						element.dis.tempTop = 0;
					}
					return element;	
				}
				var getCenter = function(element){
					if(no(element.top) || no(element.left)){
						var rect = element.getBoundingRect(element);
						element.left = rect.left;
						element.top = rect.top;
					}
					element.leftCenter = element.left + round(element.width/2);
					element.topCenter = element.top + round(element.height/2);
					return element;
				}
				var center = function(element,target){
					target = getCenter(target);
					element.left = target.leftCenter - round(element.width/2);
					element.top = target.topCenter - round(element.height/2);
					return element;
				}
				var recoil = function(element){
					element.left += round(element.colliding.dis.left*2);
					element.top += round(element.colliding.dis.top*2);
					element.style.top = element.top + 'px';
					element.style.left = element.left + 'px';
					return element;
				}
				var generateInteractions = function(o){
					o.test = function(element){
						return element;
					}
					o.explode = function(element){
						var i = 0;
						var explosion = o.explosions[0];
						while(o.explosions[i]){
							if(!o.explosions[i].till){
								explosion = o.explosions[i];
								explosion.till = o.explosions[i].originalTill;
								if(element.className == 'weps'){
									o.explosions[i].isWep = true;
								}
							
								break;
							}
							i++;
						}
						explosion = center(explosion,element);

						explosion.dis.top = round(element.dis.top/2,1);
						explosion.dis.left = round(element.dis.left/2,1);
						explosion.playSound();
						

						element.destroyed = true;

						element.style.left = '-3000px';
						element.left = -3000;

						

						

						return element;
					}
					o.destroy = function(element){
						element = recoil(element);
						if(element.answer == element.colliding.choice){
							element.colliding = o.explode(element.colliding);	
							o.answered = true;			
						
						}
						else{
							element = o.explode(element);
						}

						o.game_border.shakeFor = o.game_border.shakeTill;
						return element;
					}
					return o;
				}
				o = generateInteractions(o);

				var generateWeapons = function(o){
					var weps = 1;
					o.weps = [];
					var height = round(o.game_screen.height/7);
					while(weps){
						o.weps.push(createElement('div',{
							id: 'wep_'+weps,
							className: 'weps',
							onCollide: o.destroy,
							listen: {
								mousedown: o.carry,
								touchstart: o.carry
							},
							dis: {
								top: 0,
								left: 0
							},
							style: {
								position: absolute,
								left: 50,
								top: o.game_screen.height - ((height+ 5) * weps),
								width: height,
								height: height,
								backgroundColor: 'slateBlue',
								fontSize: '40px',
								textAlign: 'center'
							}
						}));
						append(o.game_screen,o.weps[o.weps.length-1]);
						weps--;
					}
					return o;
				}
				o = generateWeapons(o);


				var setPositions = function(elements){
					for(var i = 0; i < elements.length; i++){
						elements[i] = setPosition(elements[i]);
					}
					return elements;
				}	
				o.weps = setPositions(o.weps);
				var ranRange = function(highest,lowest,dec/*1*/){
					lowest = lowest || 0;
					var span = highest - lowest;
					dec = dec || 0;
					var ran = Math.random()*span + lowest;
					return dec * ran || round(ran);
				}
				var ranSign = function(num){
					return ([-1,1])[round(Math.random())] * num;
				}

				var generateEnemies = function(o){
					o.correctCount = no(o.correctCount) ? 0 : o.correctCount;
					o.enemies = [];

					var enemies = 5;
					while(enemies){
						o.enemies.push(createElement('div',{
								id: 'enemy_'+enemies,
								className: 'enemies',
								wait: ranRange(1000*enemies), 
								move: {
					
									top: o.line,
									left: o.line
								},
								dis: {
									top: ranRange(.5,.5,1),
									left: ranRange(-2,-2 - (o.correctCount/3+o.userSettings.Speed),1)
								},
								style: {
									position: absolute,
									left: o.game_screen.width,
									top: (5 + o.weps[0].height) * (enemies-1),
									width: o.weps[0].width,
									height: o.weps[0].height,
									backgroundColor: 'orange',
									zIndex: 2,
									fontSize: '50px',
									textAlign: 'center',
									margin: '5px 5px 5px 5px',
								}
							}
						));
				
						append(o.game_screen,o.enemies[o.enemies.length-1]);
						enemies--;
					}
					return o;
				}
				o = generateEnemies(o);
				o.enemies = setPositions(o.enemies);

				var generateReactions = function(o){
					var type = 'explosions';
					o[type] = [];
					
					var explosions = o.enemies.length;
					
					while(explosions){
						var explosion = createElement('div',o.enemies[0].props);
						explosion = assignProperties(explosion,{
								id: type+'_'+explosions,
								className: type,
								originalTill: 350,
								sound: '191694__fridobeck__explosion-4.mp3',//" Explosion 4" sound created by fridobeck, retrieved from https://www.freesound.org/people/fridobeck/sounds/191694/ license: Create Commons Attribution-NonCommercial 3.0 Unported (https://creativecommons.org/licenses/by-nc/3.0/legalcode)
								dis: {
									top: 0,
									left: 0
								},
								style: {
									width: round(explosion.width*2),
									height: round(explosion.width*2),
									left: -3000,
									top: 0,
									zIndex: 3,
									backgroundColor: 'red'
								}						
							}
						);
						append(o.game_screen,explosion);
						o[type].push(explosion);
						explosions--
					}
					return o;
				}
				o = generateReactions(o);

				var moveEnemies = function(o){
					o.allOff = true;
					for(var i = 0; i < o.enemies.length; i++){
						if(o.enemies[i].off){
							continue;
						}
						if(o.enemies[i].wait){
							o.enemies[i].wait -= updateInterval;
							o.enemies[i].wait = o.enemies[i].wait >= 0 ? 
											o.enemies[i].wait : 0; 
							continue;
						}
						o.enemies[i] = o.enemies[i].move.left(o.enemies[i]);
						o.enemies[i] = o.enemies[i].move.top(o.enemies[i]);
						o.allOff = false;
					}
					return o;
				}
				var resetPosition = function(element){
					element.left = element.originalLeft;
					element.top = element.originalTop;
					return element;
				}
				var resetEnemies = function(o){
					for(var i = 0; i < o.enemies.length; i++){
						if(o.enemies[i].off){
							o.enemies[i] = resetPosition(o.enemies[i]);
							o.enemies[i].wait = o.enemies[i].waitOriginal;
							o.enemies[i].off = false;
						}
					}
					o.allOff = false;
					return o;
				}
				var between = function(from,num,through){
					return from <= num && num <= through;
				}
				Array.prototype.each = function(func){
					for(var i = 0; i < this.length; i++){
						func(this[i]);
					}
					return this;
				}
				var isOverlapping = function(a,b){
					return between(b.top,a.top,b.bottom) && between(a.left,b.right,a.right);
				}
				var areColliding = function(a,b){
					return isOverlapping(a,b) || isOverlapping(b,a);
				}
				var detectCollision = function(o,as,bs){
					o[as].each(function(a){
						a.colliding = false;
					});
					o[as].each(function(b){
						b.colliding = false;
					});
					o[as].each(function(a){
						o[bs].each(function(b){
							if(areColliding(a,b)){
								a.colliding = b;
								b.colliding = a;
							}
						});
					});
					return o;
				}
				var interact = function(o){
					for(var key in o){
						if(o[key][0]){
							for(var i = 0; i < o[key].length; i++){
								if(!o[key][i].onCollide || !o[key][i].colliding){
									continue;
								}
								o[key][i] = o[key][i].onCollide(o[key][i]);
							}
						}
						else if(o[key].colliding){
							if(!o[key].onCollide || !o[key][i].colliding){
								continue;
							}
							o[key] = o[key].onCollide(o[key]);
						}
					}
					return o;
				}
				var detectCollisions = function(o){
					o = detectCollision(o,'weps','enemies');
					return o;
				}
				var updateTheseDims = function(o,these){
					o[these].each(function(element){
						element = updateDims(element);
						return element;
					});
					return o;
				}
				var updateAllDims = function(o){
					o = updateTheseDims(o,'weps');
					o = updateTheseDims(o,'enemies');
					return o;
				}
				var showExplosions = function(o){
					for(var i = 0; i < o.explosions.length; i++){
						if(o.explosions[i].till){
							if(!o.explosions[i].fadeTime){
								o.explosions[i].fadeTime = o.explosions[i].originalTill;
							}
							o.explosions[i].till -= updateInterval;
							o.explosions[i].till = o.explosions[i].till < 0 ? 
									0 : o.explosions[i].till;
							if(!o.explosions[i].till){
								o.explosions[i].left = -3000;
								o.enemies[i].exploded = true;

								if(o.explosions[i].isWep ){
									o.dead = true;
								}
							}
							o.explosions[i] = o.explosions[i].move.left(o.explosions[i]);
							o.explosions[i] = o.explosions[i].move.top(o.explosions[i]);
							o.explosions[i].style.opacity = round(
								o.explosions[i].till / o.explosions[i].fadeTime,2
							
							);
						}
					}

					return o;
				}
				var flashScreen = function(o){
					if(!o.game_screen.originalBGColor){
						if(!o.game_screen.style.backgroundColor){
							o.game_screen.style.backgroundColor = 'rgba(256,256,256,0)';
						}
						o.game_screen.originalBGColor = o.game_screen.style.backgroundColor;
					}
					 

					if(!o.game_border.shakeFor || 
						o.game_screen.style.backgroundColor != o.game_screen.originalBGColor){
						o.game_screen.style.backgroundColor = o.game_screen.originalBGColor
					}
					else{
						o.game_screen.style.backgroundColor = 'rgba(256,256,256,.5)';
					}

					return o;
				}

				var shakeScreen = function(o){
					if(o.game_border.shakeFor){		
						o.game_border.shakeFor -= updateInterval;
						o.game_border.shakeFor = o.game_border.sharkFor < 0 ? 
						0 : o.game_border.shakeFor;
						var shake = o.game_border.shakeFor/o.game_border.shakeTill;
						var shakeBoost = 2;
						shake = Math.sin((32+shakeBoost)*Math.PI*shake);
						o.game_border.dis.top = round(-1*(1+Math.random()) * shake);
						o.game_border.dis.left = round(-1*(1+Math.random()) * shake);
						if(!o.game_border.shakeFor){
							o.game_border = resetPosition(o.game_border);
						}
						o = flashScreen(o);
						o.game_border = o.game_border.move.top(o.game_border);
						o.game_border = o.game_border.move.left(o.game_border);
					}
					return o;
				}
				var react = function(o){
					o = showExplosions(o);
					o = shakeScreen(o);
					return o;
				}
				var max = function(nums){
					nums.sort(function(b,a){return a- b;});
					return nums[0];
				}
				var getEquation = {

					Add: function(Num){
						var a = ranRange(Num,round(Num*1/5));
						var b = ranRange(Num-a,round(Num/6));
						return [a,b];
					},
					Multiply: function(Num){
						var a = ranRange(
										Num,
										max([
											2,
											round(Num*1/5)
										])
								);
						var b = ranRange(
									max([a,2]),
									max([2,round(a*1/12)])
								);

						if(Num == 100 && b > 10){
							b = ranRange(9,2);
						}
						return [a,b];
					},
					Subtract: function(Num){
						if(Num == 100){

						}
						var a = ranRange(Num,round(Num*1/5));
						var b = ranRange(a,a*1/5);
						if(Num == 100 && b > 10){
							b = ranRange(9,(a%10)+1);
						}				
						return [a,b];
					}
				}
				getEquation.Divide = function(Num){
					var factors = getEquation.Multiply(Num);
					return [factors[0]*factors[1],factors[0]];
				}

				var toCommonMathOperator = function(jsOperator){
					return commonMathOperators[jsMathOperators.indexOf(jsOperator)];
				}
				var getMathAnswerAndHTML = function(userSettings){
					var equation = getEquation[getKeyAtVal(userSettings.Maths,userSettings.Math)](userSettings.Numbers);
					return {
						answer: commafy(eval(equation[0]+o.userSettings.Math+equation[1])),
						html: commafy(equation[0])+toCommonMathOperator(o.userSettings.Math)+commafy(equation[1])
					}
				}

				var assignMath = function(){
					//o.weps[0].answer = ranRange(9,2)+'*'+ranRange(9,2);

					var answerAndHTML = getMathAnswerAndHTML(o.userSettings);
					o.weps[0].answer = answerAndHTML.answer;//getMathAnswerAndHTML eval(equation[0]+o.userSettings.Math+equation[1]);
					o.weps[0].innerHTML = answerAndHTML.html;//equation[0]+toCommonMathOperator(o.userSettings.Math)+equation[1];
					
					var hasAnswer = false;
					for(var i = 0; i  < o.enemies.length; i++){

						var answerAndHTML = getMathAnswerAndHTML(o.userSettings);
						o.enemies[i].choice = answerAndHTML.answer;
						if(o.enemies[i].choice == o.weps[0].answer){
							hasAnswer = true;
						}
						o.enemies[i].innerHTML = o.enemies[i].choice;
					}
					if(!hasAnswer){
						ranEnemy = ranRange(o.enemies.length-1);
						o.enemies[ranEnemy].choice = o.weps[0].answer;
						o.enemies[ranEnemy].innerHTML = o.weps[0].answer;
					}
					return o;
				}
				var assignValues = function(o){
					if(o.answering){
						return o;
					}
					o.answering = true;
					//o = generateEnemies(o);
					for(var i = 0; i < o.enemies.length; i++){
						o.enemies[i].style.display = 'none';
						delete o.enemies[i];
					}
					o = generateEnemies(o);
					o.enemies = setPositions(o.enemies);
					o = generateReactions(o);
					
					o = assignMath(o);

					return o;
				}
				var checkIfAnswered = function(o){
					if(o.answered){
						o.answered = false;		
						for(var i = 0; i < o.enemies.length; i++){

							o.enemies[i] = o.explode(o.enemies[i]);
						}
					}
					return o;
				}
				var checkIfAllExploded = function(o){
					if(o.enemies.length == 0){
						return o;
					}
					var allExploded = true;
					for(var i = 0; i < o.enemies.length; i++){
						if(!o.enemies[i].exploded){
							allExploded = false;
						}
					}
					if(allExploded){
						o.score += o.nextScore + round(o.nextScore*1000/o.intervalCount);
						o.inervalCount = 0;
						o.nextScore = getNextScore(o);
						o.answering = false;
						o.correctCount = no(o.correctCount) ? 0 : o.correctCount;
						o.correctCount++;
					}
					return o;
				}
				var checkIfWon =  function(o){
					if(o.correctCount >= 10){
						o.won = true;
					}
					return o;
				}
				var checkIfDead = function(o){
					if(o.weps[0].exploded){
						o.dead = true;
					}
					return o;
				}
				var cycles = -1;
				var commafy = function(num){
					num = ''+num+'';
					if(num.length < 4){
						return num;
					}

					num = num.split('');
					num.reverse();
					for(var i = 0; i < num.length; i+=3){
						if(i == 0){
							continue;
						}
						num[i] = num[i]+',';
					}
					num.reverse();
					return num.join('');
				}
				var addWinScreen = function(o){

					o.win_screen = createElement('div',{
						id: 'win_screen',
						/*listen: {
							click: function(){
								location.reload();
							},
							touchstart: function(){
								location.reload();
							}
						},*/
						innerHTML:'YOU WIN!!! <div id="playAgain" onclick="location.reload()" ontouchstart="location.reload()">Play Again!</div><div id="score">SCORE: '+commafy(o.score)+'</div>',
						style:{
							position: absolute,
				
							top: 20,
							left: 20,
							padding: 0,
							width: 1200,
							height: 600,
							overflow: hidden,
							zIndex: 11,
							fontSize: '200px',
							display: 'none'
						}
						
					});

					append(o.game_screen,o.win_screen);

					return o;
				}
				
				var addGameOverScreen = function(o){

					o.gameOver_screen = createElement('div',{
						id: 'gameOver_screen',

						innerHTML:'GAME OVER <div id="playAgain" onclick="location.reload()" ontouchstart="location.reload()">Play Again!</div>',
						listen: {

							click: function(){
								location.reload();
							},
							touchstart: function(){
								location.reload();
							}
						
						},
						style:{
							position: absolute,
				
							top: 20,
							left: 20,
							padding: 0,
							width: 1200,
							height: 600,
							overflow: hidden,
							zIndex: 11,
							fontSize: '200px',
							display: 'none'
						}
						
					});

					append(o.game_screen,o.gameOver_screen);

					return o;
				}
				o = addGameOverScreen(o);
				o.nextScore = getNextScore(o);
				var checkForSettingChanges = function(o){
					if(o.settingChanges){
						if(is(o.settingChanges.Volume)){
							for(var sound in o.sounds){
								o.sounds[sound].volume = o.sounds[sound].volumeOriginal * o.settingChanges.Volume;
							}
						}
					}
					delete o.settingChanges;
					return o;
				}
				o.game_song = {
					sound: 'https://su-apps.org/games2017a_mt/leander2/BoxCat_Games_-_21_-_Rhythm.mp3',
					loop: true,
					volume: 0.4,
					currentTime: 7.5

				};
				o.win_song = {
					
					sound: 'https://su-apps.org/games2017a_mt/leander2/BoxCat_Games_-_07_-_Inspiration.mp3',
				};
				o.gameOver_song = {
					
					sound: 'https://su-apps.org/games2017a_mt/leander2/Ryan_Little_-_Game_Over_Life_Is.mp3',
					volume: .7,

				};
				o.explosionSound = {

					sound: '191694__fridobeck__explosion-4.mp3',
					volume: 1
				}
				loadSound(o.game_song);
				loadSound(o.gameOver_song);
				loadSound(o.win_song);
				loadSound(o.explosionSound);
				o.game_song.playSound();
				var moveBackground = function(o,background){
					if(isNaN(background.dis.left)){
						return background;
					}
					if(background.right <= o.game_screen.left){
						background.left = o.game_screen.right;
						//console.log(o.game_screen.right);
					}
					//console.log(background.dis.left);
					//console.log(background.dis.originalLeft);
					//console.log(o.correctCount);

					
					//console.log(background.dis.left);
					background = background.move.top(background);
					background = background.move.left(background);
					return background;

				}

				var moveBackgrounds = function(o){
					for(var i = 0; i < o.game_backgrounds.length; i++){
						//console.log('i:'+i);
					//	console.log(i+': '+o.game_backgrounds[i].right);
						if(typeof o.game_backgrounds[i] == 'object'){
							for(var b = 0; b < o.game_backgrounds[i].length; b++){
								if(b > 0){
									var right = o.game_backgrounds[i][b-1].left + o.game_backgrounds[i][b-1].width;
									if(right <= o.game_backgrounds[i][b].left){
										o.game_backgrounds[i][b].left = right;
									}
									else{

										o.game_backgrounds[i][b].left = o.game_backgrounds[i][b-1].left - o.game_backgrounds[i][b-1].width;
										o.game_backgrounds[i][b].originaLeft = o.game_backgrounds[i][b].left;
									}
									//console.log(o.game_backgrounds[i][b-1].right);
									
									//console.log(o.game_backgrounds[i][b].left );
								}
								else{
									if(o.correctCount > o.prevCorrect){

										o.game_backgrounds[i][b].dis.left = o.game_backgrounds[i][b].dis.originalLeft * (1 + round(o.correctCount/3,2));

									}
													//}
								}

								o.game_backgrounds[i][b] = moveBackground(o,o.game_backgrounds[i][b]);
							}
						}
						else{
							o.game_backgrounds[i] = moveBackground(o,o.game_backgrounds[i]);
						}

					}
					return o;
				}
				var redInc = 1;
				var redden = function(correctCount,rgb){
					rgb = rgb.slice(4,rgb.length-1);

					rgb = rgb.split(',');
					for(var r = 0; r < rgb.length; r++){
						rgb[r] = parseInt(rgb[r]);
					}
					
					rgb[0] -= 8*(redInc-5);
					rgb[1] -= (5 + (5*redInc));
					rgb[2] -= 7*(7-redInc);

					rgb = 'rgb('+rgb.join(',')+')';

					redInc++;
					return rgb;
				}
				var reddenBackgrounds = function(o){
					if(o.correctCount == 0){
						o.prevCorrect = 0;
						return o;
					}
					if(o.correctCount == o.prevCorrect){

						return o;
					}
					o.prevCorrect++;
					if(!o.background_masks[0]){
						return o;
					}
					var reddenedColor = redden(o.correctCount,o.background_masks[0].style.backgroundColor);
					for(var i = 0; i < o.background_masks.length; i++){
						o.background_masks[i].style.backgroundColor = reddenedColor;
					}
					//console.log(reddenedColor);
					return o;
				}

				var update = function(){
					o.intervalCount = o.intervalCount || 0;
					o.intervalCount++;
					o = checkForSettingChanges(o);
					o = moveBackgrounds(o);
					o = reddenBackgrounds(o);
					if(o.ended){
						setTimeout(update,updateInterval);
						return;
					}
					if(o.won){
						o.game_song.stop();
						o.win_song.playSound();
						o.weps[0].style.display = 'none';
						for(var i = 0; i < o.enemies.length; i++){
							o.enemies[i].style.display = 'none';
						}
						o = addWinScreen(o);
						o.win_screen.style.display = '';
						o.ended = true;
						setTimeout(update,updateInterval);
						return;
					}
					o = checkIfWon(o);

					if(o.dead){
						o.weps[0].style.display = 'none';
						for(var i = 0; i < o.enemies.length; i++){
							o.enemies[i].style.display = 'none';
						}
						o.game_song.stop();
						o.gameOver_song.playSound();
						o.gameOver_screen.style.display = '';
						o.ended = true;
						setTimeout(update,updateInterval);
						return;
					}
					o = checkIfAllExploded(o);
					o = assignValues(o);
					o = moveEnemies(o);
					o = updateAllDims(o);
					o = detectCollisions(o);
					o = interact(o);
					o = react(o);
					o = checkIfAnswered(o)
					o = resetEnemies(o);
		
					if(cycles--){
						setTimeout(update,updateInterval);
					}
					
				}

				update();


				
				
