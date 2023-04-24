<script>
  import { onMount } from "svelte";

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
    let response = await fetch("/api/progress/all", {
      method: "POST",
      body: JSON.stringify({ user }),
    });
    response = await response.json();

    progress = response.data.matchedUser.submitStatsGlobal.acSubmissionNum;

    response = await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({ user }),
    });
    response = await response.json();

    skill = response.data.matchedUser.tagProblemCounts;
    Object.values(skill).forEach((o) => {
      o.sort((a, b) => (a.problemsSolved > b.problemsSolved ? -1 : 1));
    });
  };
</script>

<div
  class="max-w-full animate-fade-in-up text-center mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull text-gray-900 dark:text-white dark:border-0"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight">Progress</h5>
  <div class="grid grid-cols-2 justify-center">
    <p class="mb-3 font-normal col-span-1">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="grid grid-cols-3 gap-6">
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
          </div>
        </div>
      {:else}
        {#each Object.entries(progress) as [_, value]}
          <p class="mt-3 text-sm sm:text-base sm:mt-0">{value.difficulty}</p>
          <p class="mb-2 text-xl sm:text-3xl font-extrabold">{value.count}</p>
        {/each}
      {/if}
    </p>
    <p class="mb-3 font-normal text-gray-900 dark:text-white">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="grid grid-cols-3 gap-6">
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
            <div class="h-2 bg-lc rounded col-span-3" />
          </div>
        </div>
      {:else}
        <div class="flex flex-col space-y-7 sm:space-y-5">
          <div class="flex justify-center mt-4 sm:mt-2">
            <select
              bind:value={level}
              class="bg-gray-100 capitalize border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2 px-1 sm:px-2 dark:bg-lc dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:border-0"
            >
              {#each Object.keys(skill) as opt}
                <option class="capitalize">{opt}</option>
              {/each}
            </select>
          </div>
          <div class="flex flex-col">
            {#each skill[`${level}`].slice(0, 3) as v}
              <p class="text-xs sm:text-sm">{v.tagName}</p>
              <p class="mb-2 text-xl sm:text-3xl font-extrabold">
                {v.problemsSolved}
              </p>
            {/each}
          </div>
        </div>
      {/if}
    </p>
  </div>
</div>
