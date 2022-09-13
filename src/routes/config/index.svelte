<script>
    import { user } from "$lib/stores/user";
    import ResetaSenha from "./_ResetaSenha.svelte";

</script>
{#if $user.cargo == "admin"}
    <ResetaSenha/>
{/if}