<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import { Circle } from "svelte-loading-spinners";

  export let user;

  let progress = {},
    loading = true,
    level = "advanced",
    skill;

  onMount(async () => {
    await getProgress();
    loading = false;
  });

  const getProgress = async () => {
    let response = await axios.get(
      `http://localhost:3000/api/lc/solved/${user}`
    );

    progress = response.data.matchedUser.submitStatsGlobal.acSubmissionNum;

    response = await axios.get(
      `http://localhost:3000/api/lc/skill_stats/${user}`
    );

    skill = response.data;
    Object.values(skill).forEach((o) => {
      o.sort((a, b) => (a.problemsSolved > b.problemsSolved ? -1 : 1));
    });
  };
</script>

<div
  class="max-w-full text-center mb-3 p-6 bg-white light:border light:border-gray-200 rounded-lg shadow dark:bg-lcdull text-gray-900 dark:text-white"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight">Progress</h5>
  <div class="flex justify-evenly">
    <p class="mb-3 font-normal">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
      {:else}
        {#each Object.entries(progress) as [_, value]}
          <p>{value.difficulty}</p>
          <p class="mb-2 text-3xl font-extrabold">{value.count}</p>
        {/each}
      {/if}
    </p>
    <p class="mb-3 font-normal text-gray-900 dark:text-white">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
      {:else}
        <div class="flex flex-col space-y-5">
          <select
            bind:value={level}
            class="bg-gray-50 capitalize light:border light:border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full py-3 px-2 dark:bg-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {#each Object.keys(skill) as opt}
              <option class="capitalize">{opt}</option>
            {/each}
          </select>
          <div>
            {#each skill[`${level}`].slice(0, 3) as v}
              <p>{v.tagName}</p>
              <p class="mb-2 text-3xl font-extrabold">{v.problemsSolved}</p>
            {/each}
          </div>
        </div>
      {/if}
    </p>
  </div>
</div>
