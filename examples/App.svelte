<script>
    import { auth } from 'frontier-frontend'
    import { Router, Navigate } from 'svelte-router-spa'
    import { routes } from './routes'
</script>

<!--Template-->
<main>
    <div class="container">
    {#if auth.user.id}
            <nav class='m10 left'>
                {#if auth.user.email}
                    <span>{auth.user.email || ''}</span>
                    <a href='/' on:click={trigger => auth.logout('/login')}>Logout</a>
                {/if}
            </nav>
            <nav>
                <Navigate to='/'>Home</Navigate>
                <Navigate to='dashboard'>Dashboard</Navigate>
                <Navigate to='example'>Example</Navigate>
            </nav>
    {:else}
        <nav>
            <Navigate to='/'>Home</Navigate>
            <Navigate to='login'>Login</Navigate>
        </nav>
    {/if}
        <Router {routes} />
    </div>
</main>
<style type="scss">
main {
    min-width: 350px;
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-flow: column;
}
.container {
    max-width: 800px;
    margin: auto;
}

:global(button, input[type=submit]) {
    display: inline-block;
    text-align: center;
    letter-spacing: inherit;
    margin: 0;
    padding: 10px;
    vertical-align: middle;
    background: #0074d9;
    color: #fff;
    border: 0;
    border-radius: 4px;
    width: auto;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &:focus {
        border-color: #666;
    }
}
:global(a) {
    text-decoration: none;
}
:global(.m10) {
    margin-bottom: 10px;
}
:global(tr:nth-child(even)) {
      background: rgba(0, 0, 0, .05);
}
:global(table) {
    text-align: left;
}

:global(td) {
    padding: .3em 2.4em .6em .3em;
}
</style>