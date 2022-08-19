<script>
    import Fa from 'svelte-fa'
    import { faEye as faEye } from '@fortawesome/free-solid-svg-icons'
</script>
<div class='outlined container'>
    <a sveltekit:prefetch href='/servicos'>
        <h3>Suporte Técnico <br>
            (Arquivo) 
            <Fa icon={faEye}/> 
        </h3>
    </a>
</div>

<style>
    .outlined.container {
        padding: 2.5em;
        padding-top: 2em;
        width: fit-content;
        flex: none;
        display: block;
        margin: auto;
    }
    h3 {
        font-weight: lighter;
        margin-top: 0;
    }
    ul {
        list-style: none;
    }
    li {
        position: relative;
    }
    li::before {
        content: '';
        position: absolute;
        left: -10%;
        bottom:35%;
        border-style: solid;
        border-color: black black transparent transparent;
        transform: rotate(45deg);
    }
    a {
        width: 100%;
    }
</style>