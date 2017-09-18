// import content from '../data/content.json'
import { isSWFormSync, doSWFormSync } from './components/form/form.js'

console.log(`Hi! I'm a service worker from ${self.origin}`)

//
// Service worker events
//
self.addEventListener('install', event => {
	console.log('sw install', event)
})

self.addEventListener('activate', event => {
	console.log('sw activate', event)
})

//
// Functional events
//
self.addEventListener('fetch', event => {
	console.log('user agent fetch', event.request, event)
})

self.addEventListener('sync', event => {
	console.log('user agent sync', event)
})

self.addEventListener('push', event => {
	console.log('user agent push', event)
})
