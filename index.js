(function () {

var mc = function () {
	this._events = [];
};

mc.prototype.on = function (event, fct, name, params) {
	if (typeof event !== "string") return false;
	event = event.toLowerCase();
	this._events = this._events || {};
	this._events[event] = this._events[event] || {
		fns: [],
		len: 0,
		names: [],
		params: [],
		once: []
	};
	this._events[event].fns.push(fct);
	this._events[event].len = this._events[event].fns.length;
	if (name) this._events[event].names.push(name);
	if (params) this._events[event].params.push(params);
};

mc.prototype.once = function (event, fct, name, params) {
	if (typeof event !== "string") return false;
	event = event.toLowerCase();
	this._events = this._events || {};
	this._events[event] = this._events[event] || {
		fns: [],
		len: 0,
		names: [],
		params: [],
		once: []
	};
	var once = this._events[event].fns.push(fct) - 1;
	ge("SETTING", once);
	this._events[event].len = this._events[event].fns.length;
	this._events[event].once.push(once);
	if (name) this._events[event].names.push(name);
	if (params) this._events[event].params.push(params);
};

mc.prototype.removeAllListeners = function () {
	this._events = {};
	return true;
};


mc.prototype.removeListener = function (event, fct) {
	if (typeof event !== "string") return false;
	event = event.toLowerCase();
	this._events = this._events || {};
	if (event in this._events === false) return;
	if (fct) this._events[event].splice(this._events[event].indexOf(fct), 1);
	else delete this._events[event];
};

mc.prototype.emit = function (event, a1, a2, a3, a4, a5, a6) {
	if (typeof event !== "string") return false;
	event = event.toLowerCase();
	this._events = this._events || {};
	var len = arguments.length;

	/*
	if (!this._events[event]) {
		var parts = event.split('/');
		var last = parts.pop();
		var nevt = parts.join('/').concat('/:');
		if (!this._events[nevt] || ['updated', 'deleted', 'added'].indexOf(last) !== -1) return false;
		else {
			event = nevt;
			var len = 3;
			a1 = {
				id: last
			};
			//console.log(__file, __line, "HEREEEEEE", parts, evt, a1);
		}
	} else {
		var len = arguments.length;
	}
	*/
	if (event in this._events === false) {
		//console.log(__file, __line, event);
		return;
	}
	xlen = this._events[event].fns.length;
	for (var i = 0; i < xlen; i++) {
		switch (len) {
			case 1:
				this._events[event].fns[i]();
				break;
			case 2:
				this._events[event].fns[i](a1);
				break;
			case 3:
				this._events[event].fns[i](a1, a2);
				break;
			case 4:
				this._events[event].fns[i](a1, a2, a3);
				break;
			case 5:
				this._events[event].fns[i](a1, a2, a3, a4);
				break;
			case 6:
				this._events[event].fns[i](a1, a2, a3, a4, a5);
				break;
			case 7:
				this._events[event].fns[i](a1, a2, a3, a4, a5, a6);
				break;
			default:
				console.log(__file, __line, "place handler for this?");
				break
		}
		var ind = this._events[event].once.indexOf(i);
		if (ind !== -1) {
			if (this._events[event].len == 1) {
				delete this._events[event];
			} else {
				this._events[event].fns.splice(i, 1);
				this._events[event].once.splice(ind, 1);
				this._events[event].len--;
				i--;
				xlen--;
			}
		}
	}
	//this._events[event].fns[i].apply(this, Array.prototype.slice.call(arguments, 1));
};
mc.prototype.asyncemit = mc.prototype.emit;

mc.prototype.chain = function (event, a1, a2, a3, a4, a5, a6, a7) {
	var self = this;
	//const time = process.hrtime();
	if (typeof event !== "string") return false;
	event = event.toLowerCase();
	self._events = self._events || {};
	if (event in self._events === false) {
		ge("EVENT NOT --------------------- PRESENT", event);
		return;
	}
	var ci = 0,
		ni = 0,
		alen = arguments.length,
		cb, fns = self._events[event].fns,
		len = self._events[event].len,
		dlen = len - 1;

	switch (alen) {
		case 0:
			n1();
			break;
		case 1:
			n1();
			break;
		case 2:
			if (typeof a1 == "function") cb = a1;
			n1(a1);
			break;
		case 3:
			if (typeof a2 == "function") cb = a2;
			n1(a1, a2);
			break;
		case 4:
			if (typeof a3 == "function") cb = a3;
			n1(a1, a2, a3);
			break;
		case 5:
			if (typeof a4 == "function") cb = a4;
			n1(a1, a2, a3, a4);
			break;
		case 6:
			if (typeof a5 == "function") cb = a5;
			n1(a1, a2, a3, a4, a5);
			break;
		case 7:
			if (typeof a6 == "function") cb = a6;
			n1(a1, a2, a3, a4, a5, a6);
			break;
		default:
			console.log(__file, __line, "place handler for this?");
			break
	}
	//n1 First call variable length, no error as first param
	function n1(a1, a2, a3, a4, a5, a6) {
		var argslen = arguments.length;
		var li = (argslen - 1);
		var args = arguments;

		if (ci == dlen && typeof cb == "function") {
			x = cb;
		}

		if (argslen == 0) {
			ni = ci++;
			fns[ni](x);
		} else if (argslen == 1) {
			ni = ci++;
			if (typeof a1 == "function") {
				cb = a1;
				fns[ni](x);
			} else {
				fns[ni](a1, x);
			}
		} else if (argslen == 2) {
			ni = ci++;
			if (typeof a2 == "function") {
				cb = a2;
				fns[ni](a1, x);
			} else {
				fns[ni](a1, a2, x);
			}
		} else if (argslen == 3) {
			ni = ci++;
			if (typeof a3 == "function") {
				cb = a3;
				fns[ni](a1, a2, x);
			} else {
				fns[ni](a1, a2, a3, x);
			}
		} else if (argslen == 4) {
			ni = ci++;
			if (typeof a4 == "function") {
				cb = a4;
				fns[ni](a1, a2, a3, x);
			} else {
				fns[ni](a1, a2, a3, a4, x);
			}
		} else if (argslen == 5) {
			ni = ci++;
			if (typeof a5 == "function") {
				cb = a5;
				fns[ni](a1, a2, a3, a4, x);
			} else {
				fns[ni](a1, a2, a3, a4, a5, x);
			}
		} else if (argslen == 6) {
			ni = ci++;
			if (typeof a6 == "function") {
				cb = a6;
				fns[ni](a1, a2, a3, a4, a5, x);
			} else {
				fns[ni](a1, a2, a3, a4, a5, a6, x);
			}
		} else {
			console.log(__file, __line, "DID YOU WANT TO CATCH MORE THAN 6?");
		}
		var ind = self._events[event].once.indexOf(ni);
		if (ind !== -1) {
			if (self._events[event].len == 1) {
				delete self._events[event];
			} else {
				self._events[event].fns.splice(ni, 1);
				self._events[event].once.splice(ind, 1);
				self._events[event].len--;
				ci--;
				dlen--;
			}
		}
	}

	function x(err, a1, a2, a3, a4, a5, a6) {
		//console.log(__file, __line, event, len, dlen, ci);
		if (err) {
			console.log("ERROR IN CHAIN at step", ci, " error ", err);
			return;
		}
		if (ci == dlen && typeof cb == "function") {
			x = cb;
		}
		if (ci > len) {
			console.log(__file, __line, "HERE WE ARE AT THE END");
			return;
		}
		ge(argslen, fns, ni);
		var argslen = arguments.length - 1;
		if (argslen <= 1) {
			ni = ci++;
			if (typeof a1 == "function") {
				fns[ni](x);
			} else {
				ge(fns, ni);
				fns[ni](a1, x);
			}
		} else if (argslen == 2) {
			ni = ci++;
			if (typeof a2 == "function") {
				fns[ni](a1, x);
			} else {
				fns[ni](a1, a2, x);
			}
		} else if (argslen == 3) {
			ni = ci++;
			if (typeof a3 == "function") {
				fns[ni](a1, a2, x);
			} else {
				fns[ni](a1, a2, a3, x);
			}
		} else if (argslen == 4) {
			ni = ci++;
			if (typeof a4 == "function") {
				fns[ni](a1, a2, a3, x);
			} else {
				fns[ni](a1, a2, a3, a4, x);
			}
		} else if (argslen == 5) {
			ni = ci++;
			if (typeof a2 == "function") {
				fns[ni](a1, a2, a3, a4, x);
			} else {
				fns[ni](a1, a2, a3, a4, a5, x);
			}
		} else if (argslen == 6) {
			ni = ci++;
			if (typeof a6 == "function") {
				cb = a6;
				fns[ni](a1, a2, a3, a4, a5, x);
			} else {
				fns[ni](a1, a2, a3, a4, a5, a6, x);
			}
		} else {
			console.log(__file, __line, "DID YOU WANT TO CATCH MORE THAN 6?");
		}
		var ind = typeof self._events[event] !== "undefined" ? self._events[event].once.indexOf(ni) : -1;
		if (ind !== -1) {
			if (self._events[event].len == 1) {
				delete self._events[event];
			} else {
				self._events[event].fns.splice(ni, 1);
				self._events[event].once.splice(ind, 1);
				self._events[event].len--;
				ci--;
				len--;
				dlen--;
			}
		}
	}
}

mc.prototype.listeners = function (event, exists) {
	if (typeof event !== "string") {
		return;
	}
	event = event.toLowerCase();
	var available = this._events[event] || [];

	//Martin Johnstone modification for simple dynamic routes TODO modify further for variables
	/*
	if (!available) {
		var parts = event.split('/');
		var last = parts.pop();
		var nevt = parts.join('/').concat('/:');
		available = this._events[nevt];
	}
	*/

	if (exists) return !!available.fns;
	if (!available.fns) return [];
	if (available.fns) return available.fns;

	console.log(__file, __line, available, "NEED TO CREATE SITUATION TO HANDLE THIS");

};

mc.mixin = function (destObject) {
	var props = ['on', 'removeListener', 'emit', 'chain', 'listeners', 'once'];
	for (var i = 0; i < props.length; i++) {
		if (typeof destObject === 'function') {
			destObject.prototype[props[i]] = mc.prototype[props[i]];
		} else {
			destObject[props[i]] = mc.prototype[props[i]];
		}
	}
	return destObject;
}

if (typeof module !== "undefined" && ('exports' in module)) {
	module.exports = mc;
} else Window.oFields = mc;

})();
