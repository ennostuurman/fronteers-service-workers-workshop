// import content from '../data/content.json'
import { isSWFormSync, doSWFormSync } from './components/form/form.js'

const CACHE_VERSION = 'v1';
const RESOURCES_TO_CACHE = [
	'/fronteers.css',
	'/index.js',
	'/logo.png',
	'/bullet.png',
	'/workshops',
	'/workshops/service-workers',
	'/workshops/service-workers/15-september-2017'
]

console.log(`Hi! I'm a service worker from ${self.origin}`)

//
// Service worker events
//
self.addEventListener('install', event => {
	console.log('sw install', event)
	event.waitUntil(
		caches.open(CACHE_VERSION).then(cache => {
			console.log('caching...')
			cache.addAll(RESOURCES_TO_CACHE)
		}).then(self.skipWaiting())
	)
})

self.addEventListener('activate', event => {
	console.log('sw activate', event)
})

//
// Functional events
//
self.addEventListener('fetch', event => {
	console.log('user agent fetch', event.request, event)
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				return response || fetch(event.request)
			})
	)
})

self.addEventListener('sync', event => {
	console.log('user agent sync', event)
	if (isSWFormSync(event)) {
		event.waitUntil(
			doSWFormSync(event)
				.then(() => console.log('sync succeeded'))
				.catch(() => {
					console.log('retry sync')
					return Promise.reject(event)
				})
		)
	}
})

self.addEventListener('push', event => {
	console.log('user agent push', event)
})
