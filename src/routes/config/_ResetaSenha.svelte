<script>
    import { auth } from "$lib/utils/db";
    let email;
</script>
<form on:submit|preventDefault={()=>auth.resetaSenha(email)}>
    <label>
        Resetar senha de: <input bind:value={email}/>
    </label>
    <input class='action button' type='submit' value='Resetar'/>
</form>