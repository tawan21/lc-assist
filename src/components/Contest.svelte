<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import Line from "./Line.svelte";

  export let user;

  let contestStats = {},
    loading = true,
    output = {},
    canvas,
    data = [];

  onMount(async () => {
    await getContestStats();
    loading = false;
  });

  const getContestStats = async () => {
    let response = await fetch("/api/contest", {
      method: "POST",
      body: JSON.stringify({ user }),
    });
    response = await response.json();

    contestStats = response.data.userContestRanking;
    const contestHistory = Object.values(
      response.data.userContestRankingHistory
    );
    const dt = [];
    let attended = false;
    contestHistory.forEach((val, i) => {
      if (!attended && val.attended) attended = true;
      if (attended) dt.push({ x: i + 1, y: Math.round(val.rating) });
    });
    data = dt;

    if (contestStats) {
      const keys = ["Attended", "Rating", "Ranking"];
      Object.entries(contestStats).forEach((e, i) => {
        output[keys[i]] = Math.round(e[1]);
      });
    }
  };
</script>

<div
  class="max-w-full animate-fade-in-up text-center flex flex-col mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull text-gray-900 dark:text-white dark:border-0"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight">Contest Stats</h5>
  <div class="">
    <div class="my-auto">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="md:grid grid-cols-3 gap-6 hidden">
            {#each { length: 10 } as _, i}
              <div class="h-2 bg-lc rounded col-span-3" />
            {/each}
          </div>
          <div class="grid grid-cols-3 gap-6 md:hidden">
            {#each { length: 20 } as _, i}
              <div class="h-2 bg-lc rounded col-span-3" />
            {/each}
          </div>
        </div>
      {:else if !contestStats}
        <p class="mb-2 text-gray-400 text-xl font-extrabold">
          No Contests Given
        </p>
      {:else}
        <div class="md:grid md:grid-cols-2 flex flex-col">
          <div class="my-auto">
            <div class="flex flex-col space-y-3 sm:space-y-9">
              {#each Object.entries(output) as [key, value]}
                <div>
                  <p>{key}</p>
                  <p class="mb-2 text-3xl font-extrabold">{value}</p>
                </div>
              {/each}
            </div>
          </div>
          <div class="max-w-xl my-auto">
            <Line {data} />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
