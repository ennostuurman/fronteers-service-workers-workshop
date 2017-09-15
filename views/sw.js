// import content from '../data/content.json'
import { isSWFormSync, doSWFormSync } from './components/form/form.js'

console.log(`Hi! I'm a service worker from ${self.origin}`)

//
// Service worker events
//
self.addEventListener('install', event => {
	console.log('sw install', event)

	// @todo
	// - Define a list of resources-to-cache
	// - Open a cache
	// - Add all resources to the cache
	// - Make sure SW waits until it should stop waiting!
	//
	// - Bonus: cache only what you have visited
	event.waitUntil(
			caches.open('v1').then(function(cache) {
				return cache.addAll([
					'/workshops',
					'/workshops/serviceworkers',
					'/workshops/service-workers/15-september-2017',
					'/fronteers.css',
					'/index.js',
					'/logo.png',
					'/bullet.png',
				]);
			})
		)
});


self.addEventListener('activate', event => {
	console.log('sw activate', event)
})
//
// Functional events
//
self.addEventListener('fetch', event => {
	console.log('user agent fetch', event.request, event)

	// @todo
	// - Respond with the cached request...
	// - ...or go to the network
	//
	// - Bonus: serve an offline page

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('sync', event => {
	console.log('user agent sync', event)
})

self.addEventListener('push', event => {
	console.log('user agent push', event)
})
