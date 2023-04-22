<script>
  import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    setDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";
  import moment from "moment";

  let user,
    needC = false,
    leet_sesh = null,
    leet_csrf = null,
    tries,
    linkBtn,
    loading = false;

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    user = JSON.parse(sessionStorage.user);
    loading = true;
    await getSession();
    sessionStorage.session = leet_sesh;
    sessionStorage.csrf = leet_csrf;
    needC = !leet_sesh || !leet_csrf;
    loading = false;
  });

  const linkLeetcode = async () => {
    await setDoc(doc(db, "lc-session", user.email, "private", "identifiers"), {
      leetcodeSession: leet_sesh,
      leetcodeCsrf: leet_csrf,
    });
    linkBtn.innerText = "Linked";
  };

  const getSession = async () => {
    const d = await getDoc(
      doc(db, "lc-session", user.email, "private", "identifiers")
    );
    if (d.exists()) {
      const dt = d.data();
      leet_sesh = dt.leetcodeSession;
      leet_csrf = dt.leetcodeCsrf;
    }
    const day = -moment("1970-01-01", "YYYY-MM-DD").diff(
      moment().startOf("day"),
      "days",
      false
    );
    const qs = await getCountFromServer(
      collection(db, `submissions/${user.email}/${d}`)
    );
    tries = qs.data().count;
    loading = false;
  };
</script>

<div
  class="min-w-full animate-fade-in-up mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull dark:border-0"
>
  <div class="flex flex-col items-center pb-10 space-y-5">
    {#if loading}
      <div class="animate-pulse flex flex-col mb-3">
        <div class="rounded-full mb-7 bg-lc h-24 w-24" />
        <div class="grid grid-cols-3 gap-9">
          <div class="h-2 bg-lc rounded col-span-3" />
          <div class="h-2 bg-lc rounded col-span-3" />
        </div>
      </div>
    {:else if user}
      <img
        alt="avatar"
        class="w-24 h-24 mb-3 rounded-full shadow-lg"
        src={user.photoURL}
      />
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        {user.displayName}
      </h5>
      <span class="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
      {#if needC}
        <input
          type="text"
          class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline"
          placeholder="LEETCODE_SESSION cookie"
          bind:value={leet_sesh}
        />
        <input
          type="text"
          class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline"
          placeholder="csrftoken cookie"
          bind:value={leet_csrf}
        />
        <button
          type="button"
          class="bg-blue-500 mb-3 hover:enabled:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={linkLeetcode}
          bind:this={linkBtn}
          disabled={leet_sesh === "" || leet_csrf === ""}>Link</button
        >
      {:else}
        <p class="text-black dark:text-white">
          <span class="font-semibold text-lg">{tries}</span> question(s) tried today
        </p>
      {/if}
    {:else}
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">
        User NOT logged in
      </h5>
    {/if}
  </div>
</div>
