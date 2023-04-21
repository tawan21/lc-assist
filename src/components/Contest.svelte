<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import { Circle } from "svelte-loading-spinners";
  import { LayerCake, Svg } from "layercake";
  import Line from "./Line.svelte";

  export let user;

  let contestStats = {},
    output = {},
    loading = true,
    data = [
      { x: 0, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ];

  onMount(async () => {
    await getContestStats();
    loading = false;
  });

  const getContestStats = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/contest_stats/${user}`
    );

    contestStats = response.data.userContestRanking;
    const contestHistory = Object.values(
      response.data.userContestRankingHistory
    ).filter((o) => o.attended == true);
    const dt = [{ x: 0, y: 1500 }];
    contestHistory.forEach((val, i) => {
      dt.push({ x: i + 1, y: Math.round(val.rating) });
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
  class="max-w-full text-center flex flex-col mb-3 p-6 bg-white light:border light:border-gray-200 rounded-lg shadow dark:bg-lcdull text-gray-900 dark:text-white"
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight"
  >
    Contest Stats
  </h5>
  <div class="flex flex-col sm:justify-evenly sm:flex-row">
    <p class="mb-3 font-normal">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
      {:else if contestStats}
        <div class="flex flex-col space-y-3 sm:space-y-9">
          {#each Object.entries(output) as [key, value]}
            <div>
              <p>{key}</p>
              <p class="mb-2 text-3xl font-extrabold">{value}</p>
            </div>
          {/each}
        </div>
      {:else}
        <p class="mb-2 text-xl font-extrabold">None given</p>
      {/if}
    </p>
    <div class="w-full sm:w-64 h-32 sm:h-72">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
      {:else}
        <LayerCake x="x" y="y" {data}>
          <Svg>
            <Line stroke="#ffa500" />
          </Svg>
        </LayerCake>
      {/if}
    </div>
  </div>
</div>
