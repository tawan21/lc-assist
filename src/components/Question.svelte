<script>
  import axios from "axios";
  import { onMount } from "svelte";

  export let ques, snippet;

  let question = {};

  onMount(() => {
    getQuestion();
  });

  const getQuestion = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/question/${ques}`
    );
    
    question = response.data.question;
    snippet = response.data.question.codeSnippets;
  };
</script>

<div
  class="max-w-full mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <h5
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    {question.questionFrontendId}. {question.questionTitle} ({question.difficulty})
  </h5>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-x-scroll">
    {@html question.content}
  </p>
</div>
