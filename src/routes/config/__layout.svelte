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
    <li class:selected={$page.url.pathname==='/config/'}><a href='/config/'>Index</a></li>
    <li class:selected={$page.url.pathname==='/config/suporte_tecnico/'}><a href='/config/suporte_tecnico/'>Suporte Técnico</a></li>
</ul>
<slot/>

<style>
    .selected > a {
        text-decoration: underline;
        text-decoration-color: var(--secondary-color);
    }
</style>