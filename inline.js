var define=define||function n(r,e,t){var o=n._p=n._p||[],f=n._m=n._m||{};t||(t=e||r,e=e&&r||[],r=n._n),o.push([r,e,t]);for(var i=0;i<o.length;i++){for(var a=o[i],e=a[1],s=0,s=0;s<e.length;s++)a=e[s]in f&&a;if(a){for(var t=a[2],h=[],s=0;s<e.length;s++)h[s]=f[e[s]];o.splice(i,1),f[a[0]]="function"==typeof t?t.apply(null,h):t,i=-1}else;}},caution={version:"0.0.0",missing:function(n,r){alert("Missing safe "+n+"\n"+r)},add:function(n,r,e){var t=caution,o=t._m=t._m||{},f=o[n]=o[n]||{h:[],u:[]};for(f.h.push(r),f.u=f.u.concat(e);e.length;){var i=new XMLHttpRequest;i.open("GET",e.shift(),!1),i.send();for(var a=i.responseText,r=sha256(a),s=0;s<f.h.length;s++){var h=f.h[s];if(!h||r.substring(0,h.length)==h)return define._n=n,eval(a),define._n=null}}this.missing(n,r)}},sha256=function r(n){function e(n,r){return n>>>r|n<<32-r}for(var t,o,f=Math.pow,i=f(2,32),a="length",s="push",h="",u=[],l=8*n[a],c=r.h=r.h||[],p=r.k=r.k||[],v=p[a],g={},_=2;64>v;_++)if(!g[_]){for(t=0;313>t;t+=_)g[t]=_;c[v]=f(_,.5)*i|0,p[v++]=f(_,1/3)*i|0}for(n+="\x80";n[a]%64-56;)n+="\x00";for(t=0;t<n[a];t++)u[t>>2]|=n.charCodeAt(t)<<(3-t)%4*8;for(u[s](l/i|0),u[s](0|l);u[a];){var d=u.splice(0,16),m=c;for(c=c.slice(0,8),t=0;64>t;t++){var E=d[t-15],M=d[t-2],k=c[0],w=c[4],x=c[7]+(e(w,6)^e(w,11)^e(w,25))+(w&c[5]^~w&c[6])+p[t]+(d[t]=16>t?d[t]:d[t-16]+(e(E,7)^e(E,18)^E>>>3)+d[t-7]+(e(M,17)^e(M,19)^M>>>10)|0),y=(e(k,2)^e(k,13)^e(k,22))+(k&c[1]^k&c[2]^c[1]&c[2]);c=[x+y|0].concat(c),c[4]=c[4]+x|0}for(t=0;8>t;t++)c[t]=c[t]+m[t]|0}for(t=0;8>t;t++)for(o=24;o>=0;o-=8){var A=c[t]>>o&255;h+=(16>A?"0":"")+A.toString(16)}return h};