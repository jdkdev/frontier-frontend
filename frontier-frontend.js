/**
* Frontier App Management
*
* */
import env from '../../.env.js'
import { writable, derived } from 'svelte/store';

let apiToken = writable(localStorage.getItem('access') || false, () => () => console.log('logout broken'))
export let currentUser = writable(JSON.parse(localStorage.getItem('currentUser') || false))

let authorization
const tokenUnsubcribe = apiToken.subscribe(value => authorization = value)

let fetchData = async function(url, options) {
    let fetchUrl = (url.charAt(0) === '/')
        ? env.apiUrl + url 
        : url

    let defaultOpts = {
        // method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // params: method === 'GET' ? JSON.stringify(data) : '{}', // body data type must match "Content-Type" header
        // body: method === 'GET' ? '{}' : JSON.stringify(data) // body data type must match "Content-Type" header
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
        },
    }
    if (authorization) {
        defaultOpts.headers.authorization = 'Bearer ' + authorization
    }

    options = options ? {...options, ...defaultOpts} : defaultOpts
    // console.log({options})
    let res = await fetch(fetchUrl, options)
    return res.ok ? await res.json() : console.log({res})
}

/**
* API interface (CRUD & custom requests)
* CRUD (GET, POST)
* STD ajx (SAVE, DESTROY, RESTORE)
* Custom (ajax)
* */

export const ajax = async function(url = '', data, opts) {
    if (data) {
        //console.log({data})
        opts['body'] = JSON.stringify(data)
    }
    // not sure if I will need to do this
    // params: method === 'GET' ? JSON.stringify(data) : '{}'

        let res = await fetchData(url, opts)
    //TODO:  respond to 401,500, let 200 through
        if (['denied','unauthorized'].includes(res.error)) return logout('/')
        else return res
}

const get = function(url) {
    return ajax(url)
}

const post = function(url, data) {
    if (! data) return alert('Save Function must submit data')

    return ajax(url, data, {
        method: 'POST'
    })
}

/**
 * Alias for post function
 */
const save = function(url, data) {
    return post(url, data)
}

const destroy = function(url) {
    return ajax(url, null, {
        method: 'DELETE'
    })
}

const patch = function(url) {
    return ajax(url, null, {
        method: 'PATCH'
    })
}

const restore = function(url) {
    return ajax(url + '/restore', null, {
        method: 'PATCH'
    })
}

export const ajx = {
    destroy,
    restore,
    save,
    patch,
    post,
    get
}


/**
 * Auth Management
 * Current User
 * Auth State (logged in/out)
 * login()
 * logout()
 *  */ 
let authenticated = derived(currentUser, ($currentUser) => {
    //What is the best way to test for user logged in
    return 'not ready'
})
let login = async function({email, password}, destination = '/', cb) {
    try {
        const data = await post(env.authUrl, {email, password})
        apiToken.set(data.accessToken)

        localStorage.setItem('access', data.accessToken)
        localStorage.setItem('refresh', data.refreshToken)
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        
        currentUser.set(data.user)
        return cb ? cb(destination) : document.location = destination
    } catch (e) {
        console.error(e);
    }
}

let logout = function(destination = '/', cb) {
    ['access', 'refresh', 'currentUser'].map(i => localStorage.removeItem(i))
    authorization = false
    currentUser.set(false)
    //Need ajax to kill refresh token

    return cb ? cb(destination) : document.location = destination
}

let user
currentUser.subscribe(value => user = value)

//export let auth = {
export let auth = writable( {
    url: env.authUrl,
    //authenticated,
    login,
    logout,
    user,
})
