import idbKeyval from 'idb-keyval'
const selector = '[data-form]'

const syncTagPrefix = `POST form`
const syncTagPrefixEscaped = syncTagPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
const syncTagPrefixRegex = new RegExp(`^${syncTagPrefixEscaped}\s*`)

export const isSupported = (
	'serviceWorker' in navigator
	&& 'SyncManager' in window
	&& 'FormData' in window
	&& 'Notification' in window
)

export default {
	enhance,
	enhanceWithin,
	isSupported,
	isSWFormSync,
	doSWFormSync
}

export function enhance(element) {
  if (!isSupported) return false

  element.onsubmit = event => {
    event.preventDefault()
    console.log('the form was submitted')
		//console.dir(event);

    // @todo
    // - Let's ask for permission to do push notifications (hint: we already built that!)
    // - Then, if the service worker is ready
    // - Register a sync event to handle the form entry (hint: we did most of the work below!)
    // - Don't forget to have a fallback if stuff fails!
    //
    // - Bonus: it would be nice to let the registrar know the form will be sent later

    registerSWPushNotification()
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => registerSWFormSync(event.target, registration))
				//.catch((event) => element.submit())
				.catch(() => console.log("form submitted directly to server"))

    return element
  }
}

export function enhanceWithin(context=document) {
	const elements = [].slice.call(context.querySelectorAll(selector))
	return elements.map(el => enhance(el)) || []
}

export function isSWFormSync(event) {
	return (event.tag.match(syncTagPrefixRegex))
}

export function doSWFormSync(event) {
	const sw = event.target.registration
	const tag = event.tag
	const action = tag.replace(syncTagPrefixRegex, '')
	const formData = new FormData()

	return idbKeyval.get(tag)
		.then(formEntries => formEntries.reduce((formData, [key, val]) => {
			formData.append(key, val)
			return formData
		}, formData))
		.then(formData => {
      console.log('formData ready to go')
      return fetch(action, {
        method: 'POST',
        body: formData
      })
    }).then(response => {
        if(response.ok) {
          sw.showNotification('Form succesfully submitted')
          idbKeyval.delete(tag)
          return Promise.resolve(response)
        } else {
        	return Promise.reject(response.error)
				}
      })
}

function registerSWPushNotification() {
	return Notification.requestPermission()
		.then(result => {
			if (result !== 'granted') {
				return Promise.reject('No permission to send push notification')
			}
		})
}

function registerSWFormSync(form, registration) {
	const tag = `${syncTagPrefix} ${form.action}`
	const formData = new FormData(form)  // https://developer.mozilla.org/en-US/docs/Web/API/FormData
	const formEntries = []

	for (let entry of formData.entries()) {
		formEntries.push(entry)
	}

	console.log('register sync')

  // @todo
	// - Store the formEntries into idb
	// - ...and register our tag on the SyncManager
	// - Hey, and return it, because it's part of a Promise chain elsewhere!

  console.log(formEntries)

	return idbKeyval.set(tag, formEntries)
      .then(() => registration.sync.register(tag))
	// alternative without return .then(registration.sync.register(tag))
}
