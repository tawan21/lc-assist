<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";

  export let user;

  let progress = {};

  onMount(() => {
    getProgress();
  });

  // const [attended, rating, ranking] = [...contestStats.data.userContestRanking];

  const getProgress = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/solved/${user}`
    );

    progress = response.data.matchedUser.submitStatsGlobal.acSubmissionNum;
  };
</script>

<div
  class="max-w-full mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    Progress
  </h5>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
    {#each Object.entries(progress) as [_, value]}
      <p>{value.difficulty}</p>
      <p class="mb-2 text-3xl font-extrabold">{value.count}</p>
    {/each}
  </p>
</div>
