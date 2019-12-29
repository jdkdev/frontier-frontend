<script>
    import { auth } from 'frontier-frontend'
	import Field from '../components/Field.svelte';

    let email = 'jordan+10@knight.works'
    let password = 'test'

</script>
<div>
    <Field name="email" bind:value={email} />
    <Field name="password" type="password" bind:value={password} />
    <input  on:click={trigger => auth.login({email, password}, '/dashboard')} type="submit" value="Sign In">
</div>