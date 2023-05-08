<script>
  import { onMount } from "svelte";
  import { Chart } from "chart.js/auto";

  let canvas;
  export let data;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let graph = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.x),
        datasets: [
          {
            label: "Rating",
            data: data.map((d) => d.y),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            pointRadius: 0,
            pointHitRadius: 5,
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
