<script>
    import { user } from "$lib/stores/user";
    import ResetaSenha from "./_ResetaSenha.svelte";

</script>
<h1>
    Configurações
</h1>
{#if $user.cargo == "admin"}
    <ResetaSenha/>
{/if}