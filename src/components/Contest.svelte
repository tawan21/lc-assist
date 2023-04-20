<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import { Circle } from "svelte-loading-spinners";

  export let user;

  let contestStats = {},
    output = {},
    loading = true;

  onMount(async () => {
    await getContestStats();
    loading = false;
  });

  const getContestStats = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/contest_stats/${user}`
    );

    contestStats = response.data.userContestRanking;
    if (contestStats) {
      const keys = ["Attended", "Rating", "Ranking"];
      Object.entries(contestStats).forEach((e, i) => {
        output[keys[i]] = Math.round(e[1]);
      });
    }
  };
</script>

<div
  class="max-w-full mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    Contest Stats
  </h5>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
    {#if loading}
      <Circle color="orange" size="3" unit="rem" />
    {:else if contestStats}
      {#each Object.entries(output) as [key, value]}
        <p>{key}</p>
        <p class="mb-2 text-3xl font-extrabold">{value}</p>
      {/each}
    {:else}
      <p class="mb-2 text-xl font-extrabold">None given</p>
    {/if}
  </p>
</div>
