import { auth } from 'frontier-frontend'
import Home from './routes/Home.svelte'
import Login from './routes/Login.svelte'
import Example from './routes/Example.svelte'
import Dashboard from './routes/admin/Dashboard.svelte'

 
const routes = [
    {
        name: '/',
        component: Home
    },
    {
        name: '/login',
        component: Login
    },
    {
        name: '/example',
        component: Example
    },
    {
        name: '/dashboard',
        component: Dashboard,
        onlyIf: { guard: auth.authenticated, redirect: '/' }
    }
]
 
export { routes }