function 舞台(画布, 图像, 方块数) {
	this.画布 = 画布;
	this.图像 = 图像;
	this.方块数 = 方块数;
	
	this.方块尺寸 = Math.round(图像.width / 方块数);
	this.填充区域 = 10;
	this.网格宽度 = 2;
	
	this.方块堆 = [];
	this.位置堆 = [];
	for (var y = 0, y1 = 0, i = 0; y < this.图像.height; y += this.方块尺寸, y1++) {
		for (var x = 0, x1 = 0; x < this.图像.width; x += this.方块尺寸, x1++, i++) {
			var 位置 = {x: x + this.填充区域 + this.网格宽度 * x1, y: y + this.填充区域 + this.网格宽度 * y1, x1: x1, y1: y1, i: i};
			this.方块堆.push({
				x: x,
				y: y,
				i: i,
				位置: 位置,
				空白: false
			});
			this.位置堆.push(位置);
		}
	}
	this.方块堆[this.方块堆.length - 1].空白 = true;
	
	this.画布.width = this.图像.width + this.填充区域 * 2 + this.网格宽度 * (方块数 - 1);
	this.画布.height = this.画布.width;
	this.画布上下文 = 画布.getContext('2d');
	this.画布上下文.fillStyle = "#BBB";
	this.画布上下文.fillRect(0, 0, this.画布.width, this.画布.height);
}

舞台.prototype.克隆 = function(o) {
	function c(o) {
	  for (var i in o) {
		this[i] = o[i];
	  }
	}
	return new c(o);
};

舞台.prototype.找位置 = function(x, y) {
	for (var i = 0; i < this.位置堆.length; i++) {
		if (x >= this.位置堆[i].x && x <= this.位置堆[i].x + this.方块尺寸 &&
			y >= this.位置堆[i].y && y <= this.位置堆[i].y + this.方块尺寸) {
			return i;	
		}
	}
	return -1;
}

舞台.prototype.用位置找方块 = function(位置) {
	for (var i = 0; i < this.方块堆.length; i++) {
		if (this.方块堆[i].位置.i == 位置) {
			return this.方块堆[i];	
		}
	}
}

舞台.prototype.用坐标找方块 = function(x1, y1) {
	for (var i = 0; i < this.方块堆.length; i++) {
		if (this.方块堆[i].位置.x1 == x1 && this.方块堆[i].位置.y1 == y1) {
			return this.方块堆[i];	
		}
	}
	return null;
}

舞台.prototype.找可到达的空白方块和路径 = function(方块) {
	var 临时;
	var 方块堆 = [];
	for (var x = 方块.位置.x1; x >= 0; x--) {
		临时 = this.用坐标找方块(x, 方块.位置.y1);
		方块堆.push(临时);
		if(临时.空白) return 方块堆;
	}
	方块堆 = [];
	for (var x = 方块.位置.x1; x <= this.方块数 - 1; x++) {
		临时 = this.用坐标找方块(x, 方块.位置.y1);
		方块堆.push(临时);
		if(临时.空白) return 方块堆;
	}
	方块堆 = [];
	for (var y = 方块.位置.y1; y >= 0; y--) {
		临时 = this.用坐标找方块(方块.位置.x1, y);
		方块堆.push(临时);
		if(临时.空白) return 方块堆;
	}
	方块堆 = [];
	for (var y = 方块.位置.y1; y <= this.方块数 - 1; y++) {
		临时 = this.用坐标找方块(方块.位置.x1, y);
		方块堆.push(临时);
		if(临时.空白) return 方块堆;
	}
	return null;
}

舞台.prototype.交换方块 = function(tile1, tile2) {
	var 临时 = this.克隆(tile2);
	tile2.x = tile1.x;
	tile2.y = tile1.y;
	tile2.i = tile1.i;
	tile2.空白 = tile1.空白;
	tile1.x = 临时.x;
	tile1.y = 临时.y;
	tile1.i = 临时.i;
	tile1.空白 = 临时.空白;
	this.绘制方块堆([tile1, tile2]);
}

舞台.prototype.轮换方块堆 = function(方块堆) {
	for (var i = 方块堆.length - 1; i > 0; i--) {
		this.交换方块(方块堆[i], 方块堆[i - 1]);
	}
}

舞台.prototype.打乱方块堆 = function() {
	var 位置堆 = Array.copy(this.位置堆, []);
	for (var i = 0; i < this.方块堆.length; i++) {
		var 位置 = Math.floor(Math.random() * (位置堆.length));
		this.方块堆[i].位置 = 位置堆[位置];
		位置堆.remove(位置, 位置);
	}
}

舞台.prototype.打乱并重绘方块堆 = function() {
	this.打乱方块堆();
	this.绘制方块堆(this.方块堆);
}

舞台.prototype.绘制方块堆 = function(方块堆) {
	for (var i = 0; i < 方块堆.length; i++) {
		this.绘制方块(方块堆[i]);
	}
}

舞台.prototype.绘制方块 = function(方块) {
	if (!方块.空白) { 
		this.画布上下文.drawImage(this.图像, 方块.x, 方块.y, this.方块尺寸, this.方块尺寸, 
			方块.位置.x, 方块.位置.y, this.方块尺寸, this.方块尺寸);
	} else {
		this.画布上下文.fillRect(方块.位置.x, 方块.位置.y, this.方块尺寸, this.方块尺寸); 	
	}
}

舞台.prototype.找空白方块 = function() {
	for (var i = 0; i < this.方块堆.length; i++) {
		if (this.方块堆[i].空白) return this.方块堆[i];	
	}
	return null;
}

舞台.prototype.拼图是否完成 = function(是否显示最后差的那个方块) {
	for (var y = 0, i = 0; y <= this.方块数 - 1; y++) {
		for (var x = 0; x <= this.方块数 - 1; x++, i++) {
			if (this.用坐标找方块(x, y).i != this.位置堆[i].i) return false;
		}
	}
	if (是否显示最后差的那个方块) {
		var 方块 = this.找空白方块();
		if (方块 != null) {
			方块.空白 = false;
			this.绘制方块(方块);
		}
	}
	return true;
}