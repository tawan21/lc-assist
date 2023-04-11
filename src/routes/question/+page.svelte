<script>
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import EditorWindow from "../../components/EditorWindow.svelte";
  import Question from "../../components/Question.svelte";
  import { db } from "../../firebase";
  import { onMount } from "svelte";
  import axios from "axios";

  let ques = "",
    clicked = false,
    user = null,
    coder = null,
    friends = [],
    languages = [
      {
        id: 71,
        name: "Python (3.8.1)",
        label: "Python (3.8.1)",
        value: "python3",
      },
      {
        id: 53,
        name: "C++ (GCC 8.3.0)",
        label: "C++ (GCC 8.3.0)",
        value: "cpp",
      },
      {
        id: 62,
        name: "Java (OpenJDK 13.0.1)",
        label: "Java (OpenJDK 13.0.1)",
        value: "java",
      },
    ],
    lang = languages[0],
    question = {},
    finalCode = "",
    outputData = null,
    snippet = "";
  $: code = Object.values(snippet).filter(
    (obj) => obj.langSlug === lang.value
  )[0];
  $: bpc = code ? Object.values(code)[1] : "";

  const getFriends = async () => {
    const collec = await getDocs(
      query(collection(db, `users/${user.email}/friends`), orderBy("added"))
    );
    const f = [coder];
    collec.forEach((doc) => {
      f.push(doc.data().mail);
    });
    friends = f;
  };

  const interpret = async () => {
    const response = await axios.post(
      `http://localhost:3000/api/lc/interpret/${ques}`,
      {
        question_id: question.questionId,
        lang: lang.value,
        typed_code: finalCode,
        judge_type: "large",
        data_input: question.exampleTestcases,
      },
      {
        headers: {
          session_id: sessionStorage.session,
          csrf_token: sessionStorage.csrf,
        },
      }
    );

    outputData = response.data;
  };

  const submit = async () => {
    const response = await axios.post(
      `http://localhost:3000/api/lc/submit/${ques}`,
      {
        question_id: question.questionId,
        lang: lang.value,
        typed_code: finalCode,
      },
      {
        headers: {
          session_id: sessionStorage.session,
          csrf_token: sessionStorage.csrf,
        },
      }
    );

    outputData = response.data;
  };

  onMount(async () => {
    user = JSON.parse(sessionStorage.user);
    coder = user.email;
    await getFriends();
  });
</script>

<div class="flex flex-col min-w-full">
  <input
    type="text"
    class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Slug"
    bind:value={ques}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    on:click={() => {
      clicked = !clicked;
    }}>Fetch</button
  >
  <div class="flex space-y-4 flex-col items-center justify-center">
    {#key clicked}
      <Question bind:snippet {ques} bind:question />
    {/key}
    <div class="flex items-center space-x-2">
      <select
        bind:value={lang}
        class="bg-gray-50 min-w-max border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {#each languages as opt}
          <option value={opt}>{opt.name}</option>
        {/each}
      </select>
      <select
        bind:value={coder}
        class="bg-gray-50 min-w-max border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {#each friends as opt}
          <option value={opt}>{opt}</option>
        {/each}
      </select>
    </div>
    {#key bpc}
      {#key coder}
        <EditorWindow {lang} {bpc} {ques} bind:code={finalCode} user={coder} />
        <textarea
          rows={5}
          placeholder={"Custom Input"}
          bind:value={question.exampleTestcases}
          class="focus:outline-none w-full resize-none border-2 border-black z-10 rounded-md shadow-md px-4 py-2 hover:shadow-lg transition duration-150 bg-white mt-2"
        />
      {/key}
    {/key}
    <div>
      <button
        type="button"
        class="bg-gray-500 mb-3 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={interpret}>Run Code</button
      >
      <button
        type="button"
        class="bg-white uppercase mb-3 hover:bg-gray-100 hover:text-green-500 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={submit}>Submit</button
      >
    </div>
    <div class="flex flex-col space-y-2 min-w-full">
      <span class="font-semibold text-xl">Output:</span>
      <div
        class="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto p-2"
      >
        {#if outputData}
          {#if "code_answer" in outputData}
            {#if outputData.run_success}
              {#each outputData.code_answer as tc}
                <p class="text-lg font-semibold">{tc}</p>
              {/each}
            {:else}
              <p>{outputData.full_runtime_error}</p>
            {/if}
          {:else if outputData.run_success}
            <p class="text-lg font-semibold text-green-400">
              {outputData.status_msg}
            </p>
            <p class="font-semibold">
              {outputData.total_correct} / {outputData.total_testcases} test cases
              passed
            </p>
          {:else}
            <p class="text-lg font-semibold text-red-500">
              {outputData.status_msg}
            </p>
            <p>{outputData.full_runtime_error}</p>
            <p class="font-semibold">
              {outputData.total_correct} / {outputData.total_testcases} test cases
              passed
            </p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.300);
  }
</style>
