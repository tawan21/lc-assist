<script>
    import Navbar from "../components/Navbar.svelte";
    import "../app.css";
    import { page } from "$app/stores";

    $: pg = $page;
</script>

{#key pg}
    <Navbar />
{/key}
<div class="flex justify-center p-5">
    <slot />
</div>
