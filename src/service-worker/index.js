import { build, files, version } from '$service-worker';

const worker = self;
const FILES = `goldseed-${version}`;
const server = '10.0.0.5:5000'

// `build` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

worker.addEventListener('install', (event) => {
	console.log('Registered! Installing...')
	event.waitUntil(
		caches
			.open(FILES)
			.then((cache) => cache.addAll(to_cache))
			.then(() => {
				worker.skipWaiting();
			})
	);
});

worker.addEventListener('activate', (event) => {
	console.log('Activating...')
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== FILES) await caches.delete(key);
			}
			worker.clients.claim();
			console.log('Now I am in charge')
		})
	);
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request) {
	const cache = await caches.open(`offline-${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response 
		const fallback = await caches.match('/404/');
		return fallback
	}
}

worker.addEventListener('fetch', (event) => {
    console.log(event)
	if (event.request.headers.get('Host') === server) { //handle the API
		event.respondWith(fetchAndCache(event.request))
	}
	else event.respondWith(
		caches.match(event.request)
			.then(async response => {
				if (response) return response 
				const fetchedResponse = await fetchAndCache(event.request)
				return fetchedResponse || Response.redirect('/404/')
			})
	)
});