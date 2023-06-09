<script>
  import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "firebase/firestore";
  import EditorWindow from "../../components/EditorWindow.svelte";
  import Question from "../../components/Question.svelte";
  import { db } from "../../firebase";
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";
  import moment from "moment";

  let ques = "",
    clicked = false,
    user = null,
    coder = null,
    loading = false,
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
    inp,
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
    loading = true;
    let response = await fetch("/api/evaluate/run", {
      method: "POST",
      body: JSON.stringify({
        data: {
          question_id: question.questionId,
          lang: lang.value,
          typed_code: finalCode,
          judge_type: "large",
          data_input: question.exampleTestcases,
        },
        headers: {
          ls: sessionStorage.session,
          lc: sessionStorage.csrf,
        },
        ques: ques,
      }),
    });
    response = await response.json();
    const id = response.interpret_id;

    let result = null,
      ct = 5;

    do {
      --ct;
      response = await fetch("/api/evaluate/check", {
        method: "POST",
        body: JSON.stringify({
          headers: {
            ls: sessionStorage.session,
            lc: sessionStorage.csrf,
          },
          id: id,
          prob: ques,
        }),
      });
      result = await response.json();
    } while (result.state !== "SUCCESS" || ct > 0);

    outputData = result;
    loading = false;
  };

  const submit = async () => {
    loading = true;
    let response = await fetch("/api/evaluate/submit", {
      method: "POST",
      body: JSON.stringify({
        data: {
          question_id: question.questionId,
          lang: lang.value,
          typed_code: finalCode,
        },
        headers: {
          ls: sessionStorage.session,
          lc: sessionStorage.csrf,
        },
        ques: ques,
      }),
    });
    response = await response.json();
    const id = response.submission_id;

    let result = null,
      ct = 5;

    do {
      --ct;
      response = await fetch("/api/evaluate/check", {
        method: "POST",
        body: JSON.stringify({
          headers: {
            ls: sessionStorage.session,
            lc: sessionStorage.csrf,
          },
          id: id,
          prob: ques,
        }),
      });
      result = await response.json();
    } while (result.state !== "SUCCESS" || ct > 0);

    outputData = result;

    if (outputData.run_success) {
      const d = -moment("1970-01-01", "YYYY-MM-DD").diff(
        moment().startOf("day"),
        "days",
        false
      );
      await setDoc(
        doc(db, `submissions/${user.email}/${d}/${ques}`),
        {
          language: lang.value,
          submitted: new Date(),
        },
        { merge: true }
      );
    }

    loading = false;
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    inp.focus();
    user = JSON.parse(sessionStorage.user);
    coder = user.email;
    await getFriends();
  });
</script>

<svelte:head>
  <title>Solve - LC Assistant</title>
</svelte:head>
<div class="flex flex-col min-w-full">
  <input
    type="text"
    class="bg-gray-300 focus:bg-gray-200 shadow mb-3 appearance-none border-0 rounded w-full py-2 px-3 leading-normal focus:outline-none focus:shadow-outline"
    placeholder="Valid Question Slug"
    bind:value={ques}
    bind:this={inp}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:enabled:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
    on:click={() => {
      clicked = !clicked;
    }}
    disabled={ques === ""}>Fetch</button
  >
  <div class="flex space-y-4 flex-col items-center justify-center">
    {#key clicked}
      <Question bind:snippet {ques} bind:question />
    {/key}
    <div
      class="flex flex-col sm:flex-row items-center space-y-2 sm:space-x-2 sm:space-y-0"
    >
      <select
        bind:value={lang}
        class="bg-gray-50 min-w-max border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-lc dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {#each languages as opt}
          <option value={opt}>{opt.name}</option>
        {/each}
      </select>
      <select
        bind:value={coder}
        class="bg-gray-50 min-w-max border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-lc dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          class="focus:outline-none w-full resize-none border-2 border-black z-10 rounded-md shadow-md px-4 py-2 hover:shadow-lg transition duration-150 bg-gray-300 hover:bg-gray-200 mt-2"
        />
      {/key}
    {/key}
    <div>
      <button
        type="button"
        class="bg-gray-600 mb-3 hover:bg-gray-700 hover:text-yellow-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={interpret}>Run Code</button
      >
      <button
        type="button"
        class="bg-gray-200 uppercase mb-3 hover:bg-white hover:text-green-500 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={submit}>Submit</button
      >
    </div>
    <div class="flex flex-col space-y-2 min-w-full">
      <div
        class="max-w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto p-2"
      >
        {#if loading}
          <div class="flex justify-center">
            <Circle color="orange" size="3" unit="rem" />
          </div>
        {:else if outputData}
          {#if "code_answer" in outputData}
            {#if outputData.run_success}
              <p class="font-semibold sm:text-lg">
                {outputData.total_correct} / {outputData.total_testcases} correct
              </p>
              {#each outputData.code_answer as tc}
                <p class="text-lg font-semibold">{tc}</p>
              {/each}
              <span class="sm:text-lg">Expected:</span>
              {#each outputData.expected_code_answer as tc}
                <p class="sm:text-lg font-semibold">{tc}</p>
              {/each}
            {:else}
              <p
                class="text-red-600 dark:text-red-500 font-semibold sm:text-lg"
              >
                {outputData.full_runtime_error
                  ? outputData.full_runtime_error
                  : outputData.status_msg}
              </p>
            {/if}
          {:else if outputData.run_success}
            <p
              class={`text-lg font-semibold ${
                outputData.status_code === 10
                  ? "text-green-500"
                  : "text-red-600"
              }`}
            >
              {outputData.status_msg}
            </p>
            <p class="font-semibold">
              {outputData.total_correct} / {outputData.total_testcases} test cases
              passed
            </p>
          {:else}
            <p
              class="text-lg font-semibold text-red-600 dark:text-red-500 sm:text-lg"
            >
              {outputData.status_msg}
            </p>
            {#if outputData.full_runtime_error}
              <p class="text-red-600 dark:text-red-500 sm:text-lg">
                {outputData.full_runtime_error}
              </p>
            {/if}
            <p class="font-semibold">
              {outputData.total_correct} / {outputData.total_testcases} test cases
              passed
            </p>
          {/if}
        {/if}
      </div>
    </div>
    {#if outputData && !("code_answer" in outputData) && outputData.status_code === 10}
      <div
        class="metrics-container text-black dark:text-white mt-4 flex flex-col space-y-3 p-5 rounded-md border-gray-300 border-2"
      >
        <p class="text-sm">
          Runtime: beats <span
            class="font-semibold px-2 py-1 rounded-md bg-gray-300 text-black"
          >
            {Math.round(outputData.runtime_percentile)}%
          </span>
        </p>
        <p class="text-sm">
          Memory: beats <span
            class="font-semibold px-2 py-1 rounded-md bg-gray-300 text-black"
          >
            {Math.round(outputData.memory_percentile)}%
          </span>
        </p>
      </div>
    {/if}
  </div>
</div>
