<script>
  import { onMount } from "svelte";
  import Donut from "./Donut.svelte";

  export let user;

  let progress = {},
    loading = true,
    level = "advanced",
    skill = {};

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

    let skl = response.data.matchedUser.tagProblemCounts;
    Object.values(skl).forEach((o, i) => {
      const key = Object.keys(skl)[i];
      o.sort((a, b) => (a.problemsSolved > b.problemsSolved ? -1 : 1));
      skill[key] = o.slice(0, 5);
    });
  };
</script>

<div
  class="max-w-full animate-fade-in-up text-center mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull text-gray-900 dark:text-white dark:border-0"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight">Progress</h5>
  <div
    class="md:grid md:grid-cols-2 md:gap-2 flex flex-col space-y-6 md:space-y-0"
  >
    <div class="my-auto">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="grid grid-cols-3 gap-6">
            {#each { length: 10 } as _, i}
              <div class="h-2 bg-lc rounded col-span-3" />
            {/each}
          </div>
        </div>
      {:else}
        {#each Object.entries(progress) as [_, value]}
          <p class="text-sm sm:text-base sm:mt-0">{value.difficulty}</p>
          <p class="mb-2 text-xl sm:text-3xl font-extrabold">{value.count}</p>
        {/each}
      {/if}
    </div>
    <div class="font-normal text-gray-900 dark:text-white">
      <div class="my-auto">
        {#if loading}
          <div class="animate-pulse flex flex-col">
            <div class="grid grid-cols-3 gap-6">
              {#each { length: 10 } as _, i}
                <div class="h-2 bg-lc rounded col-span-3" />
              {/each}
            </div>
          </div>
        {:else}
          <div class="flex flex-col space-y-7 sm:space-y-5">
            <div class="flex justify-center">
              <select
                bind:value={level}
                class="bg-gray-100 capitalize border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2 px-1 sm:px-2 dark:bg-lc dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:border-0 cursor-pointer"
              >
                {#each Object.keys(skill) as opt}
                  <option class="capitalize">{opt}</option>
                {/each}
              </select>
            </div>
            <div class="mx-auto">
              {#key level}
                <Donut {skill} {level} />
              {/key}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
