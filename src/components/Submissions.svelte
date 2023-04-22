<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import SvelteHeatmap from "svelte-heatmap";
  import moment from "moment";

  export let user;

  let submissions = {},
    loading = true,
    data,
    calendar,
    stk,
    days,
    subs = 0;

  onMount(async () => {
    await getSubmissions();
    loading = false;
  });

  const getSubmissions = async () => {
    let response = await axios.get(
      `http://localhost:3000/api/lc/submissions/${user}`
    );

    submissions = response.data.recentAcSubmissionList;

    response = await axios.get(
      `http://localhost:3000/api/lc/submission_calendar/${user}`
    );
    const { streak, submissionCalendar, totalActiveDays } =
      response.data.matchedUser.userCalendar;
    stk = streak;
    days = totalActiveDays;
    calendar = JSON.parse(submissionCalendar);
    const dt = [];
    Object.keys(calendar).forEach((date) => {
      dt.push({ date: moment(date * 1000).toDate(), value: calendar[date] });
      subs += calendar[date];
    });
    data = dt;
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
  class="max-w-full animate-fade-in-up mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull dark:border-0"
>
  <h5
    class="mb-4 text-xl sm:text-2xl font-bold tracking-tight text-green-600 dark:text-green-500"
  >
    Recent AC Submissions
  </h5>
  <p class="mb-3 font-normal text-black dark:text-white">
    {#if loading}
      <div class="animate-pulse flex flex-col">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
          <div class="h-3 bg-lc rounded col-span-3" />
        </div>
      </div>
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

<div
  class="min-w-full animate-fade-in-up bg-gray-50 dark:bg-lcdull p-4 sm:p-8 rounded"
>
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
      </div>
    </div>
  {:else}
    <div class="flex flex-col space-y-6">
      <div
        class="flex flex-col sm:flex-row justify-evenly text-black dark:text-white"
      >
        <p
          class="flex justify-center text-xs sm:text-base items-center space-x-1"
        >
          <span class="font-semibold text-lg sm:text-xl">{subs}</span><span
            >submissions in the last year</span
          >
        </p>
        <div class="flex justify-evenly sm:space-x-5">
          <div class="text-xs sm:text-sm">
            Max Streak: <span class="font-semibold">{stk}</span>
          </div>
          <div class="text-xs sm:text-sm">
            Days Active: <span class="font-semibold">{days}</span>
          </div>
        </div>
      </div>
      <div class="sm:hidden">
        <SvelteHeatmap
          cellGap={2}
          cellRadius={2}
          colors={["#FCAE1E", "#ED7117", "#B56727", "#8D4004"]}
          {data}
          dayLabelWidth={20}
          emptyColor={"#ecedf0"}
          endDate={moment().toDate()}
          fontColor={"#B2BEB5"}
          monthGap={20}
          monthLabelHeight={20}
          startDate={moment().subtract(93, "days").toDate()}
          view={"daily"}
        />
      </div>
      <div class="hidden sm:block">
        <SvelteHeatmap
          cellGap={2}
          cellRadius={2}
          colors={["#FCAE1E", "#ED7117", "#B56727", "#8D4004"]}
          {data}
          dayLabelWidth={20}
          emptyColor={"#ecedf0"}
          endDate={moment().toDate()}
          fontColor={"#B2BEB5"}
          monthGap={20}
          monthLabelHeight={20}
          startDate={moment().subtract(366, "days").toDate()}
          view={"daily"}
        />
      </div>
    </div>
  {/if}
</div>
