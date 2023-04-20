<script>
  import Friends from "../../components/Friends.svelte";
  import Requests from "../../components/Requests.svelte";

  let friends = [];
</script>

<div class="space-y-5">
  <Friends bind:friends />
  <Requests bind:friends />
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.200);
  }
</style>
