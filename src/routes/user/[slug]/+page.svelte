<script>
  import Contest from "../../../components/Contest.svelte";
  import Progress from "../../../components/Progress.svelte";
  import Submissions from "../../../components/Submissions.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
  } from "firebase/firestore";
  import { db } from "../../../firebase";
  import IntersectionObserver from "svelte-intersection-observer";

  let user = $page.params.slug,
    userDeets = null,
    e,
    loading = true,
    data,
    session,
    requested = false,
    friends = false,
    node;

  const getLeetcodeInfo = async () => {
    let response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ user }),
    });
    response = await response.json();
    userDeets = response.data.matchedUser;
  };

  const getFriends = async (mail) => {
    const collecf = await getDocs(
      query(
        collection(db, `users/${session.email}/friends`),
        where("mail", "==", mail)
      )
    );
    const collecr = await getDocs(
      query(
        collection(db, `users/${data.mail}/requests`),
        where("mail", "==", session.email)
      )
    );
    if (!collecr.empty) requested = true;
    if (!collecf.empty) friends = true;
  };

  const makeRequest = async () => {
    const dt = new Date();
    await setDoc(
      doc(db, `users/${data.mail}/requests/${session.email}`),
      {
        mail: session.email,
        added: dt,
      },
      { merge: true }
    );

    requested = true;
  };

  onMount(async () => {
    await getLeetcodeInfo();

    if (userDeets) {
      const f = await getDocs(
        query(collection(db, "lc-session"), where("username", "==", user))
      );
      f.forEach((doc) => {
        e = doc.exists();
        if (e) {
          data = doc.data();
          data["mail"] = doc.id;
        }
      });
      session = JSON.parse(sessionStorage.getItem("user"));
      if (session && e) await getFriends(data.mail);
    }

    loading = false;
  });
</script>

<svelte:head>
  <title>@{user} - LC Assistant</title>
</svelte:head>
<div class="flex flex-col min-w-full">
  <div class="min-w-full mt-3 px-4 pt-4 max-w-sm">
    <div class="flex flex-col items-center pb-10 space-y-5">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="rounded-full mb-7 bg-lcdull h-24 w-24" />
          <div class="grid grid-cols-3 gap-9">
            <div class="h-2 bg-lcdull rounded col-span-3" />
            <div class="h-2 bg-lcdull rounded col-span-3" />
            <div class="h-2 bg-lcdull rounded col-span-3" />
          </div>
        </div>
      {:else if userDeets}
        <img
          alt="avatar"
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={userDeets.profile.userAvatar}
        />
        {#if userDeets.profile.realName}
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userDeets.profile.realName}
          </h5>
        {/if}
        <h5 class="mb-1 font-medium text-gray-900 dark:text-gray-200">
          @{user}
          {#if e}
            <svg
              class="w-4 h-4 inline-block text-green-500 dark:text-green-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              /></svg
            >
          {/if}
        </h5>
        <span class="text-sm text-gray-400 dark:text-gray-200"
          >Rank <span class="font-bold">{userDeets.profile.ranking}</span></span
        >
        {#if e && session}
          {#key requested}
            <div class="text-gray-900 font-bold dark:text-gray-200">
              {#if requested}
                <span class="bg-yellow-700 px-2 py-1 rounded">Requested</span>
              {:else if friends}
                <span class="bg-violet-700 px-2 py-1 rounded">Friend</span>
              {:else if data.mail !== session.email}
                <button
                  type="button"
                  on:click={makeRequest}
                  class="bg-blue-600 hover:bg-blue-800 text-white px-2.5 py-1.5 rounded focus:outline-none focus:shadow-outline text-xs sm:text-base"
                  >Request</button
                >
              {/if}
            </div>
          {/key}
        {/if}
      {:else}
        <h5
          class="text-lg sm:text-xl text-center font-medium text-gray-900 dark:text-white"
        >
          @{user} does NOT exist
        </h5>
      {/if}
    </div>
    {#if userDeets}
      <Contest {user} />
      <IntersectionObserver once let:intersecting element={node}>
        <div bind:this={node}>
          {#if intersecting}
            <Progress {user} />
            <Submissions {user} />
          {/if}
        </div>
      </IntersectionObserver>
    {/if}
  </div>
</div>
