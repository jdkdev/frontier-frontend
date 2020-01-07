/**
* Frontier App Management
*
* */
import env from '../../.env.js'
import { writable, derived } from 'svelte/store';

let apiToken = writable(localStorage.getItem('access') || false, () => () => console.log('logout broken'))
let userStorage = localStorage.getItem('currentUser') || false
userStorage = JSON.parse(userStorage) || false

export let currentUser = writable(userStorage)

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

    console.log('fetchData')
    let res = await fetch(fetchUrl, options)
    console.log('fetched')

    if ([401,403,500].includes(res.status)) {
        logout()
        return false
    }

    else return await res.json()
    
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

    console.log('ajax')
    let res = await fetchData(url, opts)
    //console.log({res})

    if ([401,403,500].includes(res.status)) return logout('/')
    else return res
}

const get = function(url) {
    return ajax(url)
}

const post = function(url, data) {

        console.log('post')
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

        console.log('begin')
        let { accessToken = false, refreshToken = false, user = false} = await post(env.authUrl, {email, password})
        console.log('returned')

        apiToken.set(accessToken)

        localStorage.setItem('access', accessToken)
        localStorage.setItem('refresh', refreshToken)

        currentUser.set(user)
        user = JSON.stringify(user) || false
        localStorage.setItem('currentUser', user)
        

        console.log('done')
        if(accessToken) return cb ? cb(destination) : document.location = destination

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
