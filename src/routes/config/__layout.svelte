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
    <li class:selected={$page.url.pathname.includes('/config/suporte_tecnico/')}>
        Suporte Técnico
        <ul>
            <li class:selected={$page.url.pathname==='/config/suporte_tecnico/tipos/'}><a href='/config/suporte_tecnico/tipos/'>Tipos</a></li>
            <li class:selected={$page.url.pathname==='/config/suporte_tecnico/categorias/'}><a href='/config/suporte_tecnico/categorias/'>Categorias</a></li>
        </ul>
    </li>
</ul>
<slot/>

<style>
    .selected > a {
        text-decoration: underline;
        text-decoration-color: var(--secondary-color);
    }
</style>