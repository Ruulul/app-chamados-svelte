<div class='outlined container'>
    <a sveltekit:prefetch href='/servicos'>
        <h3>Suporte Técnico <br>
            (Arquivo) 
            <i class='fas fa-eye'/> 
        </h3>
    </a>
</div>

<style>
    .outlined.container {
        width: fit-content;
        height: fit-content;
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