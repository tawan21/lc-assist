<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import "../app.css";
  import { Circle } from "svelte-loading-spinners";
  import SvelteHeatmap from "svelte-heatmap";
  import moment from "moment";

  export let user;

  let submissions = {},
    loading = true,
    data,
    calendar;

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
    calendar = JSON.parse(
      response.data.matchedUser.userCalendar.submissionCalendar
    );
    const dt = [];
    Object.keys(calendar).forEach((date) => {
      dt.push({ date: moment(date * 1000).toDate(), value: calendar[date] });
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
  class="max-w-full mb-3 p-6 bg-white light:border light:border-gray-200 rounded-lg shadow dark:bg-lcdull"
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
<div class="min-w-full bg-gray-50 p-1 sm:p-8 rounded">
  {#if loading}
    <Circle color="orange" size="3" unit="rem" />
  {:else}
    <SvelteHeatmap
      cellGap={2}
      cellRadius={2}
      colors={["#FCAE1E", "#ED7117", "#B56727", "#8D4004"]}
      {data}
      dayLabelWidth={20}
      emptyColor={"#ecedf0"}
      endDate={moment().toDate()}
      monthGap={20}
      monthLabelHeight={20}
      startDate={moment().subtract(183, "days").toDate()}
      view={"daily"}
    />
  {/if}
</div>
