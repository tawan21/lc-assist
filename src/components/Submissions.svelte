<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";

  export let user;

  let submissions = {};

  onMount(() => {
    getSubmissions();
  });

  const now = new Date();

  const getSubmissions = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/submissions/${user}`
    );

    submissions = response.data.recentAcSubmissionList;
  };
</script>

<div
  class="max-w-full mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    Recent AC Submissions
  </h5>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
    {#each Object.entries(submissions) as [_, value]}
      <div class="mb-3">
        <p class="text-xl font-extrabold">{value.title}</p>
        <p>{Math.round((now - new Date(parseInt(value.timestamp)) * 1000) / 3600000)} hours ago</p>
      </div>
    {/each}
  </p>
</div>
