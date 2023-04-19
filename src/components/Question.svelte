<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";

  export let ques,
    snippet,
    question = null,
    loading = ques !== "";

  onMount(async () => {
    if (ques) await getQuestion();
    loading = false;
  });

  const getQuestion = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/question/${ques}`
    );

    if (response.status !== 200 || !response.data.question) return;
    question = response.data.question;
    snippet = response.data.question.codeSnippets;
  };
</script>

<div
  class="mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 max-w-full"
>
  {#if loading}
    <Circle color="orange" size="3" unit="rem" />
  {:else if Object.keys(question).length !== 0 || question.constructor !== Object}
    <h5
      class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
      {question.questionFrontendId}. {question.questionTitle} ({question.difficulty})
    </h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-auto">
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
