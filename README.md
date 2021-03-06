You can see my Lightning Talk presentation from 31C3 at: [geraintluff.bitbucket.org/caution-presentation/](geraintluff.bitbucket.org/caution-presentation/)

# caution.js - a module loader for tamper-proof web apps

This project provides a module loader capable of performing cryptographic verification.  It can also generate "seed" code to bootstrap this verification from a data URL.

Code is on [BitBucket](https://bitbucket.org/geraintluff/caution.js).  Full API docs are [here](doc/api.md).  There are some tests (mostly for `define()` and `require()`) in the `test/` directory of the repo.

## What do you mean "tamper-proof"?  Don't we already have HTTPS?

Web pages (normally) load all their resources (HTML/JavaScript/CSS etc.) from a remote server.  HTTPS can secure the connection to avoid modification by a third party - but you still have to trust the remote server to give you the right resources.

Being "tamper-proof" means that there is enough information stored on the user's computer (called the "seed" here) to perform cryptographic verification of the resources being loaded from the remote server.

### Why would I want a tamper-proof site?

If a web-app makes promises about security or privacy (e.g. "we never see unencrypted content"), then users might want to know when the behaviour of the web-app changes. What if somebody gains access to your server, and swaps your scripts out for malicious replacements that leak your secrets?

A tamper-proof website lets your users store a version of the site they believe to be safe.  This starts as a "seed" which can be stored in a browser bookmark, shared as a link, or downloaded as an HTML file.  If the remote server changes the resources it provides, users can be notified.

## Why a module loader?

Modern web-apps use a lot of code written by other people (in the form of modules), in order to make the actual app-specific code quite small.  These modules are managed by a module loader, which is responsible for fetching all the code and executing it in the correct order.

One goal of this project is that if verification fails, the app should be able to look in alternative locations for the resources it needs (e.g. Content Delivery Networks).  To do this, we need a module loader that understands about fallback locations and cryptographic verification.

### AMD / CommonJS / ...

There are multiple module formats, the most common at the moment being CommonJS (like Node.js/Browserify) and Asynchronous Module Definitions (a.k.a. AMD, unrelated to the chip manufacturer).

This project chose AMD as the starting point because its asynchronous nature makes it good for fallback locations.  However, CommonJS support is being developed, and support for ES6 modules is planned.

### What about bundled dependencies?

See "Using dependency bundles" below.

## Anatomy of a tamper-proof site

The most important part of the site is the seed.  When a user bookmarks this, it will be stored as a Data URL, so it tries to be as small as possible.

```html
<!DOCTYPE html>
<html>
	<body>
		<script>
			/* Standard seed code, containing
				- sha256()
				- define() and require()
				- module-loading logic */

			/* Generated code, containing
				- initial list of modules/versions
				- allowed list of SHA-256 hash values for modules
				- module search locations */
		</script>
		<script id="init">
			// App code
			document.title = "Seed loaded";
		</script>
	</body>
</html>
```

It's possible to not use the `caution` module at all, by listing all the modules you want individually.  However, a neat approach is to initially just load the `caution` module, and enable automatic fetching:

```html
<script id="init">
	// configure caution
	require('caution', function (caution) {
		var versionHints = {...};
		var hashes = {...};
	
		// Enable auto-fetching
		caution.missing(function (name) {
			caution.load(name, versionHints[name], hashes[name]);
		});
	});
		
	// OPTION 1: App logic is in a module, so load it
	require(['my-app-module'], true);
	
	// OPTION 2: App logic is included in seed
	require(['some-module'], function (someModule) {...});
</script>
```

### Generating the seed

The seed is generated by the `caution` module:

```javascript
require(['caution'], function (caution) {
	var config = {
		urls: ['http://my-site/modules/{}.js'],
		modules: {
			'caution': {
				sha256: ['8c340b24...'],
				versions: []
			}
		},
		init: '/* App JS code */ require(["caution"], function (caution) {...}'
	};
	
	var seed = caution.dataUrl(config);
});
```

(Note: if loaded from the seed, the existing init code can be fetched with `document.getElementById("init").textContent`.)

## Using dependency bundles

Websites often bundle all their dependencies into a single JavaScript file for performance, and there are helpful tools to do this (such as Browserify).  This should still work fine - making sure caution.js works happily with existing tools is obviously a high priority.

The best way to use a bundle at the moment is to list the bundle file as the first location for the `caution` module:

```javascript
var seed = caution.dataUrl({
	urls: [{'caution': 'http://my-site/path/to/bundle.js'}, ...];
	modules: {
		'caution': {...} // Only list the single dependency
	},
	init: '...'
});
```

This means the bundle is fetched first if available (to load `caution`), and no further requests are needed.  If the bundle is unavailable (and so `caution` is found from elsewhere), then it will fall back to fetching the modules individually.

## Next steps

This project is in the early stages of development, so there's a lot left to do.  Some things I'm looking forward to:

### CommonJS and ES6 module support

I started with AMD syntax because the API is straightforward and understood, but the asynchronous nature is important to the functionality I wanted - apps should be able to fall back to fetching the individual modules from CDNs or other servers if validation fails for the primary set of resources (which could be a single compiled JS file).

However, many people are more used to CommonJS syntax (although often modules support both).  This syntax can still be made asynchronous by scanning for `require('some-module')` in the code (much like Browserify does), but this is much easier if the AMD system is already working.

I'm thinking of adding support for the other module formats as modules themselves - e.g. if you were expecting to use CommonJS modules, your inline code would include `caution-commonjs` as one of the initial modules, and your loading code might look something like:

```javascript
require(['caution', 'caution-commonjs'], function (caution, commonJs) {
	commonJs.addToCaution(caution);

	// Enable auto-loading, as above
	...

	require('some-commonjs-module', true);
});
```

An ES6-compatability module could work similarly, using a shim to transform the syntax.

### caution.js *as* an ES6 module

I'm not sure on the details, but it seems like it could work, and share much of the API with the AMD/CommonJS loader.

What I'm expecting: the inline code would use the Module Loader API to add the initial security checks.  The `caution` ES6 module could then be loaded to add more sophisticated controls, very similar to the example above.

### Work better with bundles

At the moment, the bundle-trick relies on only having one initial module loaded (`caution`).  If you need multiple modules (e.g. the proposed `caution-es6` for ES6 module support), then the workaround is:

```javascript
require(['caution'], function (caution) {
	// We can't enable auto-loading yet, in case it attempts to auto-load an ES6 module
	// If it is already loaded (e.g. from the bundle) then this does nothing
	caution.load('caution-es6', [... versions ...], [... hashes ...]);
	
	require(['caution-es6'], function (cautionEs6) {
		// *Now* we can enable auto-loading
		caution.missing(function (moduleName) {...});
	});
});
```

This workaround is necessary because otherwise the loader will attempt to fetch both initial modules at once (even though they are both the same file).  This could be made better, by adding logic to prevent double-execution, double-fetching or double-hash-calculation.

### Code bundler + Node module

While caution.js should play well with tools like Browserify, it makes sense to be able to bundle things ourselves if we want to.

The output would be a (seed, bundle) pair.  The bundle may include the inline code from the seed as well (it could check for the `id="init"` script before executing).