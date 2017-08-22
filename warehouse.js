//1.判断值类型
function type(target) {
	var typeStr = typeof(target),
		toStr = Object.prototype.toString,
		objStr = {
			"[object Object]" : "object - Object",
			"[object Array]" : "array - Object",
			"[object Number]" : "number - Object",
			"[object Boolean]" : "boolean - Object",
			"[object String]" : "string - Object"
		}
	if(target === null) {
		return "null";
	}else if(typeStr === "function") {
		return "function";
	}
	if(typeStr !== "object") {
		return typeStr;
	}else{
		return objStr[toStr.call(target)];
	}
}
//2.圣杯模式
var inherite = (function () {
			var F = function () {};
			return function (Origin, Target) {
				F.prototype = Origin.prototype;
				Target.prototype = new F();
				Target.prototype.constructor = Target;
				Target.prototype.uber = Origin.prototype;
			}
		}())
//3.深度克隆
function deepClone(origin, target) {
	var target = target || {},
		arrStr = "array - Object";
	for(var prop in origin) {
		if(origin.hasOwnProperty(prop)) {
			if(typeof(origin[prop]) === "object") {
				if(type(origin[prop]) == arrStr) {
					target[prop] = [];							
				}else{
					target[prop] = {};
				}
				deepClone(origin[prop], target[prop]);
			}else{
				target[prop] = origin[prop];
			}
		}
	}
	return target;
}
//4.获取属性 attr放字符串
function getStyle (obj, attr) {
    if (obj.getCurrentStyle) {
        return obj.getCurrentStyle[attr];
    }else {
        return window.getComputedStyle(obj, false)[attr];
    }
}
//5.多属性运动 例：(josn处) {width: 100, top: 30, opacity: 0.5}
function startMove (obj, json, func) {
    clearInterval(obj.timer);
    var iCur = 0;
    var iSpeed = 0;
    if(json.opacity) {
        json.opacity *= 100;
    }
    obj.timer = setInterval(function () {
        var bStop = true;
        for (var name in json) {
            if (name === 'opacity') {
                iCur = parseFloat( getStyle(obj, 'opacity') ) * 100;
            }else {
                iCur = parseInt( getStyle(obj, name) );
            }
            iSpeed = (json[name] - iCur) / 7;
            if (iSpeed > 0) {
                iSpeed = Math.ceil(iSpeed);
            }else {
                iSpeed = Math.floor(iSpeed);
            }
            if (name === 'opacity') {
                obj.style.opacity = ( iCur + iSpeed) / 100;
            }else {
                obj.style[name] = iCur + iSpeed + 'px';
            }
            if (iCur != json[name]) {
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(obj.timer);
            func();
        }
    }, 30);
}
//6.数组去重
// Array.prototype.unique = function () {
// 	var arr = [],
// 		obj = {},
// 		len = this.length;
// 	for(var i = 0; i < len; i ++) {
// 		if(!obj[this[i]]) {
// 			obj[this[i]] = "abc";
// 			arr.push(this[i]);
// 		}
// 	}
// 	return arr;
// }
//7.遍历元素e的n层祖先节点
function retParent(e, n) {
	while(e && n) {
		e = e.parentNode;
		n--
	}
	return e;
}
//8.遍历元素e的第n个兄弟元素节点，n为正返回后面的，n为负返回前面的
function retSibling(e, n) {
	while(e && n) {
		if(n > 0) {
			if(e.nextElementSibling) {
				e = e.nextElementSibling;
			}else{
				for(e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling) {}
			}
			n --;
		}else{
			if (e.previousElementSibling) {
				e = e.previousElemntSibling;
				for(e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling) {}
			}
			n ++;
		}
	}
	return e;
}
//9.模拟children
// Node.prototype.MyChildren = function () {
// 	var child = this.childNodes,
// 		len = child.length,
// 		obj = {
// 			length : 0,
// 			push : Array.prototype.push,
// 			splice : Array.prototype.splice
// 		}
// 		for(var i = 0; i < len; i++) {
// 			if (child[i].nodeType == 1) {
// 				obj.push(chiid[i]);
// 			}
// 		}
// }
//10.insertAfter方法
// Element.prototype.insertAfter = function (target, afterNode) {
// 	var nextNode = afterNode.nextElementSibling;
// 	if(nextNode) {
// 		this.insertBefore(target, nextNode);
// 	}else{
// 		this.appendChild(target);
// 	}
// }
//11.封装getScollOffset方法
function getScollOffset() {
	if(window.pageXOffset + 1) {
		return {
			x : window.pageXOffset,
			y : window.pageYOffset
		}
	}else{
		return{
			x : document.body.scollLeft + document.documentElement.scrollLeft,
			y : document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}
//12.封装getViewportOffset
function getViewportOffset() {
	if(window.innerWidth) {
		return {
			w : window.innerWidth,
			h : window.innerHeight
		}
	}else if(document.compat === "CSS1Compat") {
		return {
			w : document.documentElement.clientWidth,
			h : document.documentElement.clientHeight
		}
	}else{
		return {
			w : document.body.clientWidth,
			h : document.body.clientHeight
		}
	}
}
//13.kookie函数
var cookieTool = {
	setCookie: function (key, value, iDay) {
	  var oDate = new Date();
	  oDate.setDate(oDate.getDate() + iDay);
	  document.cookie = key + '=' + value + ";expires=" + oDate;
	  return this;
	},
	removeCookie: function (key) {
	  this.setCookie(key, '', -1);
	  return this;
	},
	getCookie: function(key, callBack) {
	  var cookieArr = document.cookie.split('; ');
	  for(var i = 0; i < cookieArr.length; i++) {
	    var arr = cookieArr[i].split('=');
	    if(arr[0] === key) {
	      callBack(arr[1]);
	    }
	  }
	  return this;
	}
}
//14.Ajax函数
function Ajax(method, url, flag, data, callBack) {
	var xhr = null;
	if(window.XMLHttpRequest) {
		xhr = new window.XMLHttpRequest();
	}else{
		xhr = new window.ActiveXObject('microsoft.XMLHTTP');
	}
	method = method.toUpperCase();
	if(method === 'POST') {
		xhr.open('POST',url, flag);
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);
	}else if(method === 'GET') {
		xhr.open('GET', url + '?' +  data, flag);
		xhr.send(data);
	}
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				// console.log('a');
				callBack(xhr.responseText);
			}else{
				alert('error');
			}
		}
	}
}
//15.绑定事件：
function addEvent(elem, type, handle) {
	if(elem.addEventListener) {
		elem.addEventListener(type, handle, false);
	}else if(elem.attachEvent) {
		elem['temp'] = function () {
			handle.call(elem);
		}
		elem.attachEvent('on' + type, elem['temp']);
	}else{
		elem['on' + type] = handle;
	}
}