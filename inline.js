var define=function n(t,e,r){var o=n._p=n._p||[],i=n._m=n._m||{};r||(r=e||t,e=e&&t||[],t=n._n),o.push([t,e,r]);for(var f=0;f<o.length;f++){for(var a=o[f],e=a[1],s=0,s=0;s<e.length;s++)a=e[s]in i&&a;if(a){for(var r=a[2],l=[],s=0;s<e.length;s++)l[s]=i[e[s]];o.splice(f,1),i[a[0]]="function"==typeof r?r.apply(null,l):r,f=-1}else;}},caution={_t:[],_h:{},version:"0.1.0",missing:function(n,t){alert("Missing safe module: "+n+"\n"+t.join("\n"))},get:function(n,t,e){var r=new XMLHttpRequest;r.open("GET",n,!1),r.send();for(var o=r.responseText,i=sha256(o),f=0;f<t.length;f++){var a=t[f];if(i.substring(0,a.length)==a)return e(null,o)}e(1)},template:function(n){this._t=this._t.concat(n)},add:function(n,t){function e(f,a){f?i<o.length?r.get(o[i++].replace(/{.*}/,n),t,e):r.missing(n,t):(define._n=n,eval(a),define._n=null)}var r=this,o=r._t;r._h[n]=t;var i=0;e(1)}},sha256=function t(n){function e(n,t){return n>>>t|n<<32-t}for(var r,o,i=Math.pow,f=i(2,32),a="length",s="push",l="",u=[],h=8*n[a],c=t.h=t.h||[],p=t.k=t.k||[],v=p[a],g={},_=2;64>v;_++)if(!g[_]){for(r=0;313>r;r+=_)g[r]=_;c[v]=i(_,.5)*f|0,p[v++]=i(_,1/3)*f|0}for(n+="\x80";n[a]%64-56;)n+="\x00";for(r=0;r<n[a];r++)u[r>>2]|=n.charCodeAt(r)<<(3-r)%4*8;for(u[s](h/f|0),u[s](0|h);u[a];){var d=u.splice(0,16),m=c;for(c=c.slice(0,8),r=0;64>r;r++){var E=d[r-15],M=d[r-2],k=c[0],w=c[4],x=c[7]+(e(w,6)^e(w,11)^e(w,25))+(w&c[5]^~w&c[6])+p[r]+(d[r]=16>r?d[r]:d[r-16]+(e(E,7)^e(E,18)^E>>>3)+d[r-7]+(e(M,17)^e(M,19)^M>>>10)|0),y=(e(k,2)^e(k,13)^e(k,22))+(k&c[1]^k&c[2]^c[1]&c[2]);c=[x+y|0].concat(c),c[4]=c[4]+x|0}for(r=0;8>r;r++)c[r]=c[r]+m[r]|0}for(r=0;8>r;r++)for(o=24;o>=0;o-=8){var A=c[r]>>o&255;l+=(16>A?"0":"")+A.toString(16)}return l};