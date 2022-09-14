<script context='module'>
    export async function load() {
        return {
            stuff: {
                title: 'Configurações'
            }
        }
    }
</script>
<script>
    import { page } from '$app/stores'
</script>
<h1>
    Menu
</h1>
<ul>
    <li><a class=button class:action={$page.url.pathname==='/config/'} href='/config/'>Index</a></li>
    <li><a class=button class:action={$page.url.pathname==='/config/suporte_tecnico/'} href='/config/suporte_tecnico/'>Suporte Técnico</a></li>
</ul>
<slot/>

<style>
    a {
        text-decoration: none;
        padding: 0.5em;
        display: block;
        width: 10em;
    }
    li {
        margin: 1.5em;
        margin-left: 0;
        list-style: none;
    }
    ul {
        padding: 0;
    }
</style>