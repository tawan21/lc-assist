<script>
  import { Chart } from "chart.js/auto";
  import { onMount } from "svelte";

  let canvas;
  export let skill, level;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let graph = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: skill[level].map((o) => o.tagName),
        datasets: [
          {
            label: "Solved",
            data: skill[level].map((o) => o.problemsSolved),
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(105, 105, 186)",
              "rgb(205, 255, 126)",
            ],
            borderColor: "rgb(211, 211, 211)",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  });
</script>

<canvas bind:this={canvas} />
