<script>
  import axios from "axios";
  import Contest from "../../../components/Contest.svelte";
  import Progress from "../../../components/Progress.svelte";
  import Submissions from "../../../components/Submissions.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Circle } from "svelte-loading-spinners";
  import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
  } from "firebase/firestore";
  import { db } from "../../../firebase";

  let user = $page.params.slug,
    userDeets = null,
    e,
    loading = true,
    data,
    session,
    requested = false,
    reqBtn,
    friends = false;

  const getLeetcodeInfo = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/username/${user}`
    );
    userDeets = response.data.data.matchedUser;
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
        collection(db, `users/${session.email}/requests`),
        where("mail", "==", mail)
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

    reqBtn.innerText = "Requested";
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

<div class="flex flex-col min-w-full">
  <div
    class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-center pb-10 space-y-5">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
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
          {#if e}<span class="bg-green-700 px-1 rounded text-sm">LA User</span
            >{/if}
        </h5>
        <span class="text-sm text-gray-500 dark:text-gray-400"
          >Rank <span class="font-bold">{userDeets.profile.ranking}</span></span
        >
        {#if e && session}
          <div class="text-gray-900 font-bold dark:text-gray-200">
            {#if requested}
              <span class="bg-yellow-700 px-2 py-1 rounded">Requested</span>
            {:else if friends}
              <span class="bg-violet-700 px-2 py-1 rounded">Friends</span>
            {:else if data.mail !== session.email}
              <button
                type="button"
                bind:this={reqBtn}
                on:click={makeRequest}
                class="bg-blue-600 hover:bg-blue-800 text-white px-3 py-2 rounded focus:outline-none focus:shadow-outline text-xs sm:text-base"
                >Request</button
              >
            {/if}
          </div>
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
      <Progress {user} />
      <Submissions {user} />
    {/if}
  </div>
</div>
