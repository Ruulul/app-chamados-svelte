<script>
    import { goto } from '$app/navigation'
    import { auth } from '$lib/utils/db.js'
    auth.logout()
    goto('/login')
</script>
