<script>
    export let nome = 'Dummy'
</script>
<h1>E aí</h1>
<h2>{nome}</h2>

{#if true}
    <p>Valor <span style='color: red'>condicional</span></p>
{:else}
    <p>Isso não devia aparecer</p>
{/if}