<script>
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";

  export let ques,
    snippet,
    question = null,
    err = true,
    loading = ques !== "";

  onMount(async () => {
    if (ques) await getQuestion();
    loading = false;
  });

  const getQuestion = async () => {
    err = false;
    let response = await fetch("/api/question", {
      method: "POST",
      body: JSON.stringify({ ques }),
    });
    response = await response.json();

    if (response.errors) {
      err = true;
      return;
    }
    question = response.data.question;
    snippet = response.data.question.codeSnippets;
  };
</script>

<div
  class="animate-fade-in-up mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull max-w-full dark:border-0"
>
  {#if loading}
    <Circle color="orange" size="3" unit="rem" />
  {:else if !err}
    <h5
      class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
      {question.questionFrontendId}. {question.questionTitle} ({question.difficulty})
    </h5>
    <p class="mb-3 font-normal text-gray-400 dark:text-gray-200 overflow-auto">
      {@html question.content}
    </p>
  {:else}
    <h5
      class="mb-2 text-2xl text-center font-bold tracking-tight text-red-600 dark:text-red-500"
    >
      Invalid Question Slug
    </h5>
  {/if}
</div>
