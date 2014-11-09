define([], function () {
	var inlineJs = "var define=function n(t,e,r){var o=n._p=n._p||[],i=n._m=n._m||{};r||(r=e||t,e=e&&t||[],t=n._n||Math.random()),o.push([t,e,r]);for(var a=0;a<o.length;a++){for(var f=o[a],e=f[1],s=0,s=0;s<e.length;s++)f=e[s]in i&&f;if(f){for(var r=f[2],c=[],s=0;s<e.length;s++)c[s]=i[e[s]];o.splice(a,1),i[f[0]]=\"function\"==typeof r?r.apply(null,c):r,a=-1}else;}},caution={_t:[],_m:{},version:\"0.2.0\",missing:function(n,t){alert(\"Missing safe module: \"+n+\"\\n\"+t.join(\"\\n\"))},loc:function(n){this._t.unshift(n)},get:function(n,t,e){var r=new XMLHttpRequest;r.open(\"GET\",n),r.onreadystatechange=function(){if(4==r.readyState){for(var n=r.responseText.replace(/\\r/g,\"\"),o=sha256(encodeURI(n).replace(/%../g,function(n){return String.fromCharCode(parseInt(n[1]+n[2],16))})),i=0;i<t.length;i++){var a=t[i];if(!(r.status/100^2)&&o.substring(0,a.length)==a)return e(null,n,o)}e(1)}};try{r.send()}catch(o){e(o)}},load:function(n,t){function e(f,s,c){f?a<i.length?(r=\"string\"==typeof i[a]?i[a++].replace(/{.*?}/,n):i[a++][n],r?o.get(r,t,e):e(f)):o.missing(n,t):(define._n=n,o._m[n]=[r,c],eval(s),define._n=\"\")}var r,o=this,i=o._t,a=0;e(1)}},sha256=function t(n){function e(n,t){return n>>>t|n<<32-t}for(var r,o,i=Math.pow,a=i(2,32),f=\"length\",s=\"push\",c=\"\",u=[],l=8*n[f],h=t.h=t.h||[],g=t.k=t.k||[],p=g[f],v={},d=2;64>p;d++)if(!v[d]){for(r=0;313>r;r+=d)v[r]=d;h[p]=i(d,.5)*a|0,g[p++]=i(d,1/3)*a|0}for(n+=\"\\x80\";n[f]%64-56;)n+=\"\\x00\";for(r=0;r<n[f];r++){if(o=n.charCodeAt(r),o>>8)return;u[r>>2]|=o<<(3-r)%4*8}for(u[s](l/a|0),u[s](l),o=0;o<u[f];){var _=u.slice(o,o+=16),m=h;for(h=h.slice(0,8),r=0;64>r;r++){var y=_[r-15],M=_[r-2],S=h[0],C=h[4],E=h[7]+(e(C,6)^e(C,11)^e(C,25))+(C&h[5]^~C&h[6])+g[r]+(_[r]=16>r?_[r]:_[r-16]+(e(y,7)^e(y,18)^y>>>3)+_[r-7]+(e(M,17)^e(M,19)^M>>>10)|0),I=(e(S,2)^e(S,13)^e(S,22))+(S&h[1]^S&h[2]^h[1]&h[2]);h=[E+I|0].concat(h),h[4]=h[4]+E|0}for(r=0;8>r;r++)h[r]=h[r]+m[r]|0}for(r=0;8>r;r++)for(o=3;o+1;o--){var R=h[r]>>8*o&255;c+=(16>R?0:\"\")+R.toString(16)}return c};";
	
	if (typeof caution !== 'object') {
		var func = new Function(inlineJs + 'return caution;');
		caution = func();
	}
	
	caution.utf8 = function (content) {
		return encodeURI(content).replace(/%../g, function (part) {
			return String.fromCharCode(parseInt(part[1] + part[2], 16));
		});
	};
	
	caution.config = function () {
		var result = {
			template: this._t.slice(0),
			init: {}
		};
		for (var key in this._i) {
			result.init[key] = this._i[key].slice(0);
		}
		return result;
	};
	
	caution.dataUrl = function (config, customCode) {
		config = config || this.config();
		var js = inlineJs.replace('_t:[]', '_t:' + JSON.stringify(config.template));
		js += 'caution.init(' + JSON.stringify(config.init) + ');';
		customCode = customCode || '';
		if (typeof customCode === 'object') {
			var vars = [];
			for (var key in customCode) {
				vars.push(key + '=' + JSON.stringify(customCode[key]));
			}
			customCode = 'var ' + vars.join(',') + ';';
		}
		js += customCode;
		var html = '<!DOCTYPE html><html><body><script>' + js + '</script></body></html>';
		
		if (typeof btoa === 'function') {
			return 'data:text/html;base64,' + btoa(html);
		} else {
			return 'data:text/html,' + encodeURI(html);
		}
	};
	
	caution.hashShim = function (name, url, hashes, returnValue) {
		caution.get(url, hashes, function (error, js, hash) {
			if (error) return caution.missing(name, hashes);

			caution._m[name] = [url, hash];
			
			define(name, [], new Function(js + '\n;return ' + (returnValue || name)+ ';'));
		});
	};
	
	caution.hashes = function (name) {
		if (name) return (caution._m[name] || [])[1];
		
		var result = {};
		for (var key in caution._m) {
			result[key] = caution._m[key][1];
		}
		return result;
	};
	
	return caution;
});