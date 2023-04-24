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
  import CryptoJS from "crypto-js";

  let user,
    needC = true,
    needP,
    leet_sesh = "",
    leet_csrf = "",
    encPhrase = "",
    tries,
    loading;

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    user = JSON.parse(sessionStorage.user);
    loading = true;
    await getSession();
    needP = sessionStorage.getItem("phrase") === null;
    loading = false;
  });

  const linkLeetcode = async () => {
    sessionStorage.phrase = encPhrase;
    needP = false;

    if (!needC) {
      leet_sesh = CryptoJS.AES.decrypt(
        leet_sesh,
        sessionStorage.phrase
      ).toString(CryptoJS.enc.Utf8);
      leet_csrf = CryptoJS.AES.decrypt(
        leet_csrf,
        sessionStorage.phrase
      ).toString(CryptoJS.enc.Utf8);
      sessionStorage.session = leet_sesh;
      sessionStorage.csrf = leet_csrf;
    } else {
      sessionStorage.session = leet_sesh;
      sessionStorage.csrf = leet_csrf;

      const ls = CryptoJS.AES.encrypt(leet_sesh, encPhrase).toString();
      const lc = CryptoJS.AES.encrypt(leet_csrf, encPhrase).toString();

      await setDoc(
        doc(db, "lc-session", user.email, "private", "identifiers"),
        {
          leetcodeSession: ls,
          leetcodeCsrf: lc,
        }
      );

      needC = false;
    }
  };

  const getSession = async () => {
    const d = await getDoc(
      doc(db, "lc-session", user.email, "private", "identifiers")
    );
    if (d.exists()) {
      needC = false;
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
      collection(db, `submissions/${user.email}/${day}`)
    );
    tries = qs.data().count;
  };
</script>

<div
  class="min-w-full animate-fade-in-up mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull dark:border-0"
>
  <div class="flex flex-col items-center pb-10 space-y-6">
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
      {#key needC}
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
        {/if}
      {/key}
      {#key needP}
        {#if needP}
          <div class="w-full">
            <input
              type="text"
              class="shadow mb-1 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline"
              placeholder="Your Encryption Passphrase"
              bind:value={encPhrase}
            />
            <div class="text-gray-400 text-xs sm:text-sm ml-1">
              The above passphrase will be used to encrypt the identifiers
              before storing. The passphrase itself will NEVER be stored.
              Remember it as it will be required for decrypting the identifiers
              each time.
            </div>
          </div>
          <button
            type="button"
            class="bg-blue-500 mb-3 hover:enabled:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={linkLeetcode}
            disabled={leet_sesh === "" || leet_csrf === "" || encPhrase === ""}
            >Link</button
          >
        {:else}
          <p class="text-black dark:text-white">
            <span class="font-semibold text-lg">{tries}</span> question(s) tried
            today
          </p>
        {/if}
      {/key}
    {:else}
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">
        User NOT logged in
      </h5>
    {/if}
  </div>
</div>
