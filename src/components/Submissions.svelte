<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import { Circle } from "svelte-loading-spinners";

  export let user;

  let submissions = {},
    loading = true;

  onMount(async () => {
    await getSubmissions();
    loading = false;
  });

  const now = new Date();

  const getSubmissions = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/submissions/${user}`
    );

    submissions = response.data.recentAcSubmissionList;
  };

  const timeElapsed = (timestamp) => {
    const dt = new Date(parseInt(timestamp * 1000));
    return dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      day: "2-digit",
      month: "long",
    });
  };
</script>

<div
  class="max-w-full mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <h5
    class="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-green-600 dark:text-green-500"
  >
    Recent AC Submissions
  </h5>
  <p class="mb-3 font-normal text-black dark:text-white">
    {#if loading}
      <Circle color="orange" size="3" unit="rem" />
    {:else}
      {#each Object.entries(submissions) as [_, value]}
        <div class="mb-3">
          <p class="text-lg sm:text-xl font-bold sm:font-extrabold">
            {value.title}
          </p>
          <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
            {timeElapsed(value.timestamp)}
          </p>
        </div>
      {/each}
    {/if}
  </p>
</div>
