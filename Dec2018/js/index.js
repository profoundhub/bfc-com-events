"use strict";
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noise = noise;
var PI = Math.PI;
var HALF_PI = 0.5 * PI;
var TAU = 2 * PI;
var cos = Math.cos;
var sin = Math.sin;
var abs = Math.abs;
var pow = Math.pow;
var sqrt = Math.sqrt;
var round = Math.round;
var rand = function rand(n) {
	return n * Math.random();
};
var randRange = function randRange(n) {
	return n - rand(2 * n);
};
var fadeIn = function fadeIn(t, m) {
	return t / m;
};
var fadeOut = function fadeOut(t, m) {
	return (m - t) / m;
};
var fadeInOut = function fadeInOut(t, m) {
	return abs((t + 0.5 * m) % m - 0.5 * m) / (0.5 * m);
};

var tick = undefined,
    CONFIG = undefined;

var Config = function () {
	function Config(opts) {
		_classCallCheck(this, Config);

		this.apply(opts);
	}

	Config.prototype.apply = function apply(opts) {
		Object.assign(this, opts);
	};

	Config.prototype.merge = function merge(opts) {
		for (var _iterator = opts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			if (_isArray) {
				if (_i >= _iterator.length) break;
				key = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				key = _i.value;
			}

			this.set(key, opts[key]);
		}
	};

	Config.prototype.set = function set(key, value) {
		if (!key || !value || !this.hasOwnProperty(key)) return;else this[key] = value;
	};

	Config.prototype.get = function get(key) {
		return this[key];
	};

	Config.prototype.insert = function insert(key, value) {
		if (!key || !value) return;else this[key] = value;
	};

	Config.prototype.delete = function _delete(key) {
		if (!key) return;else delete this[key];
	};

	return Config;
}();

var Mouse = function () {
	function Mouse() {
		var element = arguments.length <= 0 || arguments[0] === undefined ? window : arguments[0];

		_classCallCheck(this, Mouse);

		this.element = element;
		this.hover = false;
		this.dblClick = false;
		this.mouseDown = false;
		this.position = new Vector2(0.5 * window.innerWidth, 0.5 * window.innerHeight);
		this.lastPosition = this.position.clone();
		this.targetPosition = new Vector2(0.5 * window.innerWidth, 0.5 * window.innerHeight);
		this.speed = 0;
		this.initEvents();
	}

	Mouse.prototype.initEvents = function initEvents() {
		var events = ["mouseenter", "mousemove", "mouseover", "mouseleave", "mouseout", "click", "dblclick", "contextmenu", "mousedown", "mouseup"];
		for (var _iterator2 = events, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref = _i2.value;
			}

			var e = _ref;

			this.element.addEventListener(e, this.handler.bind(this));
		}
	};

	Mouse.prototype.handler = function handler(e) {
		this.lastPosition.x = this.position.x;
		this.lastPosition.y = this.position.y;
		this.position.x = e.clientX;
		this.position.y = e.clientY;
		this.speed = sqrt(pow(this.position.x - this.lastPosition.x, 2) + pow(this.position.y - this.lastPosition.y, 2));
		switch (e.type) {
			case "mouseenter":
				this.hover = true;
				break;
			case "mousemove":
				this.hover = true;
				break;
			case "mouseout":
				this.hover = false;
				break;
			case "mouseleave":
				this.hover = false;
				break;
			case "mousedown":
				this.mouseDown = true;
				break;
			case "mouseup":
				this.mouseDown = false;
				break;
			case "dblClick":
				this.dblClick = true;
				break;
			default:
				break;
		}
	};

	Mouse.prototype.repel = function repel(other, threshold) {
		var distance = this.position.distanceTo(other.position);
		if (distance < threshold) {
			var distNorm = (threshold - distance) / threshold;
			var theta = this.position.angleTo(other.position) + 0.35 * PI - distNorm * 0.35 * PI;
			var speedFactor = CONFIG.targetSpeed + CONFIG.mouse.repel * distNorm;
			var x = cos(theta) * speedFactor;
			var y = sin(theta) * speedFactor;
			var target = {
				x: x,
				y: y
			};
			other.velocity.lerp(target, CONFIG.mouse.lerpAmtActual);
		}
	};

	Mouse.prototype.attract = function attract(other, threshold) {
		var distance = other.position.distanceTo(this.position);
		if (distance < 2) {
			other.reset = true;
			return;
		} else if (distance < threshold) {
			var distNorm = (threshold - distance) / threshold;
			var theta = other.position.angleTo(this.position) - 0.35 * PI + distNorm * 0.35 * PI;
			var speedFactor = CONFIG.targetSpeed + CONFIG.mouse.attract * distNorm;
			var x = cos(theta) * speedFactor;
			var y = sin(theta) * speedFactor;
			var target = {
				x: x,
				y: y
			};
			other.velocity.lerp(target, CONFIG.mouse.lerpAmtActual);
		}
	};

	return Mouse;
}();

var VectorArrayObject = function () {
	function VectorArrayObject(count, max) {
		_classCallCheck(this, VectorArrayObject);

		this.count = count;
		this.max = max;
		this.x = new Float32Array(max);
		this.y = new Float32Array(max);
	}

	VectorArrayObject.prototype.get = function get(i) {
		return new Vector2(this.x[i], this.y[i]);
	};

	VectorArrayObject.prototype.getX = function getX(i) {
		return this.x[i];
	};

	VectorArrayObject.prototype.getY = function getY(i) {
		return this.y[i];
	};

	VectorArrayObject.prototype.set = function set(i, x, y) {
		this.x[i] = x;
		this.y[i] = y;
		return this;
	};

	VectorArrayObject.prototype.setX = function setX(i, x) {
		this.x[i] = x;
		return this;
	};

	VectorArrayObject.prototype.setY = function setY(i, y) {
		this.y[i] = y;
		return this;
	};

	return VectorArrayObject;
}();

var VectorArrayObjectController = function () {
	function VectorArrayObjectController(count, max) {
		_classCallCheck(this, VectorArrayObjectController);

		this.count = count;
		this.max = max;
		this.life = new VectorArrayObject(this.count, this.max);
		this.vertices = new VectorArrayObject(this.count, this.max);
		this.velocities = new VectorArrayObject(this.count, this.max);
	}

	VectorArrayObjectController.prototype.getLife = function getLife(i) {
		return this.life.getX(i);
	};

	VectorArrayObjectController.prototype.getTTL = function getTTL(i) {
		return this.life.getY(i);
	};

	VectorArrayObjectController.prototype.setLife = function setLife(i, life) {
		this.life.setX(i, life);
		return this;
	};

	VectorArrayObjectController.prototype.setTTL = function setTTL(i, ttl) {
		this.life.setY(i, ttl);
		return this;
	};

	VectorArrayObjectController.prototype.getVertex = function getVertex(i) {
		return this.vertices.get(i);
	};

	VectorArrayObjectController.prototype.setVertex = function setVertex(i, x, y) {
		this.vertices.set(i, x, y);
		return this;
	};

	VectorArrayObjectController.prototype.getVelocity = function getVelocity(i) {
		return this.velocities.get(i);
	};

	VectorArrayObjectController.prototype.setVelocity = function setVelocity(i, x, y) {
		this.velocities.set(i, x, y);
		return this;
	};

	return VectorArrayObjectController;
}();

var RenderObject = function () {
	function RenderObject(x, y) {
		_classCallCheck(this, RenderObject);

		this.position = new Vector2(x, y);
		this.lastPosition = this.position.clone();
		this.velocity = new Vector2();
	}

	RenderObject.prototype.getPosition = function getPosition() {
		return this.position.clone();
	};

	RenderObject.prototype.setPosition = function setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
		return this;
	};

	RenderObject.prototype.setLastPosition = function setLastPosition() {
		this.lastPosition.x = this.position.x;
		this.lastPosition.y = this.position.y;
		return this;
	};

	RenderObject.prototype.getVelocity = function getVelocity() {
		return this.velocity.clone();
	};

	RenderObject.prototype.setVelocity = function setVelocity(x, y) {
		this.velocity.x = x;
		this.velocity.y = y;
		return this;
	};

	RenderObject.prototype.getLife = function getLife() {
		return this.life;
	};

	RenderObject.prototype.setLife = function setLife(n) {
		this.life = n;
		return this;
	};

	RenderObject.prototype.addNoise = function addNoise() {
		var theta = noise.simplex3(this.position.x * CONFIG.noise.xOffActual, this.position.y * CONFIG.noise.yOffActual, tick * CONFIG.noise.zOffActual) * TAU,
		    x = cos(theta) * CONFIG.targetSpeed,
		    y = sin(theta) * CONFIG.targetSpeed;
		this.velocity.lerp({
			x: x,
			y: y
		}, CONFIG.noise.lerpAmtActual);
		return this;
	};

	return RenderObject;
}();

var Particle = function (_RenderObject) {
	_inherits(Particle, _RenderObject);

	function Particle(x, y) {
		_classCallCheck(this, Particle);

		var _this = _possibleConstructorReturn(this, _RenderObject.call(this, x, y));

		_this.ttl = CONFIG.particles.maxTTL;
		_this.reset = false;
		_this.setHueFunction();
		_this.setAlphaFunction();
		return _this;
	}

	Particle.prototype.update = function update(vX, vY) {
		this.setVelocity(vX, vY).setLastPosition().setColor();

		if (CONFIG.noise.enabled) this.addNoise();

		this.position.add(this.velocity);
		return this;
	};

	Particle.prototype.setNormalizedSpeed = function setNormalizedSpeed() {
		this.normalizedSpeed = (CONFIG.targetSpeed - abs(0.5 * (this.velocity.x + this.velocity.y))) / CONFIG.targetSpeed;
		return this;
	};

	Particle.prototype.setColor = function setColor() {
		this.color = "hsla(" + this.getHue() + ", 100%, " + (this.normalizedSpeed * 30 + 40) + "%, " + this.getAlpha() + ")";
		return this;
	};

	Particle.prototype.setHueFunction = function setHueFunction() {
		var _this2 = this;

		switch (CONFIG.particles.colorStyle) {
			case "static":
				this.getHue = function () {
					return CONFIG.particles.baseHue;
				};
				break;
			case "speed":
				this.getHue = function () {
					return CONFIG.particles.baseHue + _this2.normalizedSpeed * CONFIG.particles.hueRange;
				};
				break;
			case "noise":
				this.getHue = function () {
					return CONFIG.particles.baseHue + (1 + noise.simplex3(_this2.position.x * CONFIG.noise.xOffActual, _this2.position.y * CONFIG.noise.yOffActual, tick * CONFIG.noise.zOffActual)) * 0.5 * CONFIG.particles.hueRange;
				};
				break;
			default:
				this.getHue = function () {
					return CONFIG.particles.baseHue;
				};
				break;
		}
	};

	Particle.prototype.setAlphaFunction = function setAlphaFunction() {
		var _this3 = this;

		switch (CONFIG.particles.fade) {
			case "none":
				this.getAlpha = function () {
					return 1;
				};
				break;
			case "in":
				this.getAlpha = function () {
					return fadeIn(_this3.life, _this3.ttl);
				};
				break;
			case "out":
				this.getAlpha = function () {
					return fadeOut(_this3.life, _this3.ttl);
				};
				break;
			case "inOut":
				this.getAlpha = function () {
					return fadeInOut(_this3.life, _this3.ttl);
				};
				break;
			default:
				this.getAlpha = function () {
					return 1;
				};
				break;
		}
	};

	Particle.prototype.draw = function draw(canvas) {
		canvas.buffer.save();
		canvas.buffer.globalCompositeOperation = "lighter";
		canvas.line(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y, CONFIG.particles.width, this.color);
		canvas.buffer.restore();
		return this;
	};

	return Particle;
}(RenderObject);

var ParticleField = function (_VectorArrayObjectCon) {
	_inherits(ParticleField, _VectorArrayObjectCon);

	function ParticleField() {
		var count = arguments.length <= 0 || arguments[0] === undefined ? CONFIG.particles.count : arguments[0];
		var max = arguments.length <= 1 || arguments[1] === undefined ? CONFIG.particles.max : arguments[1];
		var bounds = arguments[2];
		var canvas = arguments[3];
		var mouse = arguments[4];

		_classCallCheck(this, ParticleField);

		var _this4 = _possibleConstructorReturn(this, _VectorArrayObjectCon.call(this, count, max));

		_this4.bounds = bounds;
		_this4.canvas = canvas;
		_this4.mouse = mouse;
		_this4.noise = new Float32Array(CONFIG.particles.max);
		_this4.create();
		return _this4;
	}

	ParticleField.prototype.create = function create() {
		this.renderTarget = new Particle(0, 0, this.bounds);
		for (var i = 0; i < this.count; i++) {
			this.initRenderTarget(i).setLife(i, round(rand(CONFIG.particles.maxTTL)));
		}
	};

	ParticleField.prototype.initRenderTarget = function initRenderTarget(i) {
		var theta = undefined,
		    vX = undefined,
		    vY = undefined,
		    x = rand(this.bounds.x),
		    y = rand(this.bounds.y);

		if (CONFIG.noise.enabled) {
			theta = noise.simplex3(x * CONFIG.noise.xOffActual, y * CONFIG.noise.yOffActual, tick * CONFIG.noise.zOffActual) * TAU;
			vX = cos(theta) * (0.5 * (CONFIG.targetSpeed + CONFIG.particles.speed));
			vY = sin(theta) * (0.5 * (CONFIG.targetSpeed + CONFIG.particles.speed));
		} else {
			vX = randRange(CONFIG.particles.speed);
			vY = randRange(CONFIG.particles.speed);
		}
		this.renderTarget.setVelocity(vX, vY);
		this.setVertex(i, x, y).setLife(i, 0).setTTL(i, CONFIG.particles.maxTTL).setVelocity(i, vX, vY);
		this.renderTarget.reset = false;
		return this;
	};

	ParticleField.prototype.update = function update() {
		for (var i = this.count - 1; i >= 0; i--) {
			this.life.x[i]++;

			this.renderTarget.setLife(this.getLife(i)).setPosition(this.vertices.x[i], this.vertices.y[i]).update(this.velocities.x[i], this.velocities.y[i]).setNormalizedSpeed().draw(this.canvas);

			this.checkMouse().checkBounds().setVertex(i, this.renderTarget.position.x, this.renderTarget.position.y).setVelocity(i, this.renderTarget.velocity.x, this.renderTarget.velocity.y);
			if (this.renderTarget.reset) this.initRenderTarget(i);
		}
	};

	ParticleField.prototype.addParticles = function addParticles(n) {
		var i = undefined,
		    x = undefined,
		    y = undefined;
		for (i = this.count; i <= this.count + n; i++) {
			this.initRenderTarget(i);
		}
		this.count += n;
	};

	ParticleField.prototype.removeParticles = function removeParticles(n) {
		for (var i = this.count - n; i < this.count - 1; i++) {
			this.setVertex(i, 0, 0);
			this.setVelocity(i, 0, 0);
		}
		this.count -= n;
	};

	ParticleField.prototype.checkMouse = function checkMouse() {
		if (this.mouse.hover && !this.mouse.mouseDown) this.mouse.repel(this.renderTarget, CONFIG.mouse.threshold);
		if (this.mouse.mouseDown) this.mouse.attract(this.renderTarget, CONFIG.mouse.threshold);
		return this;
	};

	ParticleField.prototype.checkBounds = function checkBounds() {
		if (this.renderTarget.position.x > this.bounds.x || this.renderTarget.position.x < 0 || this.renderTarget.position.y > this.bounds.y || this.renderTarget.position.y < 0) {
			this.renderTarget.reset = true;
		}
		return this;
	};

	return ParticleField;
}(VectorArrayObjectController);

var Canvas = function () {
	function Canvas(selector) {
		_classCallCheck(this, Canvas);

		this.element = document.querySelector(selector) || function () {
			element.style = "position: absolute; width: 100vw; height: 100vh;";
			document.body.appendChild(element);
			return element;
		}();
		this.ctx = this.element.getContext("2d");
		this.frame = document.createElement("canvas");
		this.buffer = this.frame.getContext("2d");
		this.dimensions = new Vector2();
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
	}

	Canvas.prototype.resize = function resize() {
		this.dimensions.x = this.frame.width = this.element.width = window.innerWidth;
		this.dimensions.y = this.frame.height = this.element.height = window.innerHeight;
	};

	Canvas.prototype.clear = function clear() {
		this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
		this.buffer.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
	};

	Canvas.prototype.line = function line(x1, y1, x2, y2, w, c) {
		this.buffer.beginPath();
		this.buffer.strokeStyle = c;
		this.buffer.lineWidth = w;
		this.buffer.moveTo(x1, y1);
		this.buffer.lineTo(x2, y2);
		this.buffer.stroke();
		this.buffer.closePath();
	};

	Canvas.prototype.rect = function rect(x, y, w, h, c) {
		this.buffer.fillStyle = c;
		this.buffer.fillRect(x, y, w, h);
	};

	Canvas.prototype.arc = function arc(x, y, r, s, e, c) {
		this.buffer.beginPath();
		this.buffer.fillStyle = c;
		this.buffer.arc(x, y, r, s, e);
		this.buffer.fill();
		this.buffer.closePath();
	};

	Canvas.prototype.render = function render() {
		this.ctx.drawImage(this.frame, 0, 0);
	};

	Canvas.prototype.drawImage = function drawImage(image) {
		var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
		var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

		this.buffer.drawImage(image, x, y);
	};

	return Canvas;
}();

var AppController = function () {
	function AppController(config) {
		_classCallCheck(this, AppController);

		this.running = false;
		this.canvas = new Canvas(CONFIG.selector.main);
		this.background = new Canvas(CONFIG.selector.background);
		this.mouse = new Mouse(this.canvas.element);
		this.initParticleField();
		this.setup();
		this.initStats();
		this.initGUI();
		this.loop();
	}

	AppController.prototype.setup = function setup() {
		var _this5 = this;

		window.requestAnimationFrame = function () {
			return window.requestAnimationFrame || window.requestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		}();
		window.addEventListener("keypress", function (e) {
			return e.key === "e" ? _this5.export() : null;
		});
	};

	AppController.prototype.initParticleField = function initParticleField() {
		this.particleField = new ParticleField(CONFIG.particles.count, CONFIG.particles.max, this.canvas.dimensions, this.canvas, this.mouse);
	};

	AppController.prototype.drawBackground = function drawBackground() {
		this.background.rect(0, 0, this.canvas.dimensions.x, this.canvas.dimensions.y, "hsla(0,0%,0%," + CONFIG.background.alpha + ")");
		if (CONFIG.background.glow) {
			this.background.buffer.filter = "\n\t\t\t\tsaturate(" + (200 + CONFIG.background.glowAmt * 500) + "%) \n\t\t\t\tbrightness(" + (200 + CONFIG.background.glowAmt * 500) + "%)\n\t\t\t\tblur(" + CONFIG.background.glowAmt + "px)\n\t\t\t";
			this.background.drawImage(this.canvas.frame);
			this.background.buffer.save();
			this.background.buffer.globalCompositeOperation = "lighter";
			this.background.drawImage(this.canvas.frame);
			this.background.buffer.restore();
		}
		this.background.render();
	};

	AppController.prototype.loop = function loop() {
		this.stats.begin();

		tick++;
		this.canvas.clear();
		this.particleField.update();
		this.canvas.render();
		this.drawBackground();
		window.requestAnimationFrame(this.loop.bind(this));

		// this.stats.end();		
	};

	AppController.prototype.initStats = function initStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.domElement);
	};

	AppController.prototype.initGUI = function initGUI() {
		var _this6 = this;

		this.gui = {
			parent: new dat.GUI(),
			folders: []
		};

		var f0 = this.gui.parent.addFolder("Background");
		this.gui.folders.push(f0);
		f0.add(CONFIG.background, "alpha").step(0.05).min(0.1).max(1);

		f0.add(CONFIG.background, "glow");
		f0.add(CONFIG.background, "glowAmt").step(1).min(1).max(5);

		var f1 = this.gui.parent.addFolder("Noise");
		this.gui.folders.push(f1);
		f1.add(CONFIG.noise, "enabled").onFinishChange(function (en) {
			return CONFIG.targetSpeed = en ? CONFIG.noise.strength + CONFIG.particles.speed : CONFIG.particles.speed;
		});
		f1.add(CONFIG.noise, "strength").step(0.1).min(0.1).max(1).onChange(function (n) {
			return CONFIG.targetSpeed = CONFIG.noise.enabled ? CONFIG.noise.strength + CONFIG.particles.speed : CONFIG.particles.speed;
		});
		f1.add(CONFIG.noise, "lerpAmt").step(0.1).min(0.1).max(5).onChange(function (n) {
			return CONFIG.noise.lerpAmtActual = n / 100;
		});
		f1.add(CONFIG.noise, "xOff").step(0.125).min(0.125).max(20).onChange(function (n) {
			return CONFIG.noise.xOffActual = 1 / (n * 500);
		});
		f1.add(CONFIG.noise, "yOff").step(0.125).min(0.125).max(20).onChange(function (n) {
			return CONFIG.noise.yOffActual = 1 / (n * 500);
		});
		f1.add(CONFIG.noise, "zOff").step(0.125).min(0.125).max(20).onChange(function (n) {
			return CONFIG.noise.zOffActual = 1 / (n * 500);
		});

		var f2 = this.gui.parent.addFolder("Mouse");
		this.gui.folders.push(f2);
		f2.add(CONFIG.mouse, "threshold").step(10).min(100).max(800);
		f2.add(CONFIG.mouse, "lerpAmt").step(0.5).min(0.5).max(10).onFinishChange(function (n) {
			return CONFIG.mouse.lerpAmtActual = n / 100;
		});
		f2.add(CONFIG.mouse, "attract").step(1).min(1).max(10);
		f2.add(CONFIG.mouse, "repel").step(1).min(1).max(10);

		var f3 = this.gui.parent.addFolder("Particles");
		this.gui.folders.push(f3);
		f3.add(CONFIG.particles, "count").step(10).min(10).max(CONFIG.particles.max).onChange(function (n) {
			return n < _this6.particleField.count ? _this6.particleField.removeParticles(_this6.particleField.count - n) : _this6.particleField.addParticles(n - _this6.particleField.count);
		});
		f3.add(CONFIG.particles, "speed").step(0.5).min(1).max(5).onChange(function (n) {
			return CONFIG.targetSpeed = CONFIG.noise.enabled ? CONFIG.noise.strength + n : n;
		});
		f3.add(CONFIG.particles, "maxTTL").step(50).min(50).max(1000).onFinishChange(this.initParticleField.bind(this));
		f3.add(CONFIG.particles, "width").step(0.5).min(0.5).max(5);
		f3.add(CONFIG.particles, "colorStyle", ["static", "speed", "noise"]).onChange(function () {
			return _this6.particleField.renderTarget.setHueFunction();
		});
		f3.add(CONFIG.particles, "fade", ["none", "in", "out", "inOut"]).onChange(function () {
			return _this6.particleField.renderTarget.setAlphaFunction();
		});
		f3.add(CONFIG.particles, "baseHue").step(1).min(0).max(360);
		f3.add(CONFIG.particles, "hueRange").step(1).min(0).max(360);

		this.gui.parent.add(this, "export");
		this.gui.parent.add(this, "randomize");

		this.gui.folders.forEach(function (folder) {
			return folder.open();
		});
	};

	AppController.prototype.resetGUI = function resetGUI() {
		this.gui.parent.destroy();
		this.gui.folders = [];
		this.initGUI();
	};

	AppController.prototype.export = function _export() {
		var $canvas = document.createElement("canvas"),
		    $ctx = $canvas.getContext("2d");

		$canvas.width = this.canvas.frame.width;
		$canvas.height = this.canvas.frame.height;
		$ctx.drawImage(this.background.frame, 0, 0);
		$ctx.drawImage(this.canvas.frame, 0, 0);
		$canvas.toBlob(function (blob) {
			return saveAs(blob, "screenshot.png");
		});
	};

	AppController.prototype.randomize = function randomize() {
		noise.seed(round(rand(2000)));
		initDefaults();
		this.resetGUI();
		this.initParticleField();
	};

	return AppController;
}();

function initDefaults() {
	var DEFAULTS = {
		selector: {
			main: ".main",
			background: ".background"
		},
		background: {
			alpha: 0.1 * round(rand(5)) + 0.3,
			glow: true,
			glowAmt: 2 + round(rand(3))
		},
		particles: {
			count: 10 * round(rand(100)) + 700,
			max: 3000,
			maxTTL: 100 * (1 + round(rand(9))),
			speed: 1 + round(rand(4)),
			width: 1 + round(rand(3)),
			colorStyle: round(rand(1)) ? "speed" : "noise",
			fade: "inOut",
			baseHue: round(rand(360)),
			hueRange: 90 + round(rand(180))
		},
		noise: {
			enabled: true,
			strength: 0.1 * round(rand(9)) + 0.1,
			lerpAmt: 1 + round(rand(4)),
			xOff: 1 + round(rand(19)),
			yOff: 1 + round(rand(19)),
			zOff: 1 + round(rand(19))
		},
		mouse: {
			attract: 1 + round(rand(9)),
			repel: 1 + round(rand(9)),
			threshold: 100 + round(rand(700)),
			lerpAmt: 1 + round(rand(9))
		},
		gravity: {
			enabled: true,
			amount: 0
		},
		friction: {
			enabled: false,
			amount: 0.999
		}
	};

	DEFAULTS.noise.xOffActual = 1 / (DEFAULTS.noise.xOff * 100);
	DEFAULTS.noise.yOffActual = 1 / (DEFAULTS.noise.yOff * 100);
	DEFAULTS.noise.zOffActual = 1 / (DEFAULTS.noise.zOff * 100);
	DEFAULTS.noise.lerpAmtActual = DEFAULTS.noise.lerpAmt / 100;
	DEFAULTS.mouse.lerpAmtActual = DEFAULTS.mouse.lerpAmt / 100;
	DEFAULTS.targetSpeed = DEFAULTS.noise.enabled ? DEFAULTS.particles.speed + DEFAULTS.noise.strength : DEFAULTS.particles.speed;

	CONFIG = new Config(DEFAULTS);
}

document.addEventListener("DOMContentLoaded", function () {
	noise.seed(round(rand(2000)));
	tick = 0;
	initDefaults();
	var app = new AppController(CONFIG);
});