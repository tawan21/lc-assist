<script>
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import EditorWindow from "../../components/EditorWindow.svelte";
  import Question from "../../components/Question.svelte";
  import { db } from "../../firebase";
  import { onMount } from "svelte";

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
      <Question bind:snippet {ques} />
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
        <EditorWindow {lang} {bpc} {ques} user={coder} />
      {/key}
    {/key}
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.300);
  }
</style>
