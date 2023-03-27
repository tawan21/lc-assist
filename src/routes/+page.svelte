<script>
  import axios from "axios";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import Contest from "../components/Contest.svelte";
  import Submissions from "../components/Submissions.svelte";
  import Progress from "../components/Progress.svelte";

  let user = "",
    clicked = false;
</script>

<div class="flex flex-col">
  <h2 class="text-2xl mb-3 font-semibold underline">Enter username:</h2>
  <input
    type="text"
    class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="@"
    bind:value={user}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    on:click={() => {
      clicked = !clicked;
    }}>Fetch</button
  >
  <div>
    {#key clicked}
      <Contest {user} />
      <Progress {user} />
      <Submissions {user} />
    {/key}
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.300);
  }
</style>
