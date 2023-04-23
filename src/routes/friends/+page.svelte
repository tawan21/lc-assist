<script>
  import Friends from "../../components/Friends.svelte";
  import Requests from "../../components/Requests.svelte";

  let friends = [];
</script>

<svelte:head>
  <title>Friends - LC Assistant</title>
</svelte:head>
<div class="space-y-5">
  <Friends bind:friends />
  <Requests bind:friends />
</div>
