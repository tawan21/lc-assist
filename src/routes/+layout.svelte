<script>
    import Navbar from "../components/Navbar.svelte";
    import "../app.css";
    import { page } from "$app/stores";

    $: pg = $page;

    let loggedIn;
</script>

{#key pg}
    <Navbar bind:loggedIn />
{/key}
<div class="flex flex-col justify-center p-3">
    {#key loggedIn}
        <slot />
    {/key}
</div>
