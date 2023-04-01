<script>
  import axios from "axios";
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";

  let user,
    leet_sesh,
    sesh,
    needC = false,
    lcData;

  onMount(() => {
    user = JSON.parse(sessionStorage.user);
    getSession();
  });

  const linkLeetcode = async () => {
    await setDoc(doc(db, "lc-session", user.email), {
      leetcodeSession: leet_sesh,
    });
  };

  const getSession = async () => {
    const d = await getDoc(doc(db, "lc-session", user.email));
    if (d.exists()) sesh = d.data().leetcodeSession;
    else needC = true;
  };

  const getLeetcodeInfo = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/user/${sesh}`
    );

    lcData = response.data.userStatus;
  };
</script>

<div
  class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <div class="flex flex-col items-center pb-10 space-y-5">
    {#if user}
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
          class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="LEETCODE_SESSION cookie"
          bind:value={leet_sesh}
        />
        <button
          type="button"
          class="bg-blue-500 mb-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          on:click={linkLeetcode}>Link</button
        >
      {/if}
    {/if}
  </div>
</div>
