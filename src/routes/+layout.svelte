<script>
    import Navbar from "../components/Navbar.svelte";
    import "../app.css";
</script>

<Navbar />
<div class="flex justify-center p-5">
    <slot />
</div>
