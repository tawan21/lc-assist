<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";

  export let user;

  let contestStats = {};

  onMount(() => {
    getContestStats();
  });

  // const [attended, rating, ranking] = [...contestStats.data.userContestRanking];

  const getContestStats = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/contest_stats/${user}`
    );

    contestStats = response.data.userContestRanking;
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
    {#if contestStats}
      {#each Object.entries(contestStats) as [key, value]}
        <p>{key}</p>
        <p class="mb-2 text-3xl font-extrabold">{value}</p>
      {/each}
    {/if}
  </p>
</div>
