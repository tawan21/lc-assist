<script>
  import {
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";
  import { Circle } from "svelte-loading-spinners";
  import { goto } from "$app/navigation";
  import moment from "moment";

  let mail = "",
    loading = false,
    user = null,
    ct = {};

  export let friends = [];

  const getFriends = async () => {
    let collec = await getDocs(
      query(collection(db, `users/${user.email}/friends`), orderBy("added"))
    );
    const f = [];
    const d = -moment("1970-01-01", "YYYY-MM-DD").diff(
      moment().startOf("day"),
      "days",
      false
    );
    collec.forEach(async (doc) => {
      const data = doc.data();
      f.push({ mail: data.mail, added: data.added });
      const qs = await getCountFromServer(
        collection(db, `submissions/${data.mail}/${d}`)
      );
      ct[data.mail] = qs.data().count;
    });
    f.sort((f1, f2) => (ct[f1] > ct[f2] ? 1 : -1));
    friends = f;
  };

  const makeRequest = async () => {
    const dt = new Date();
    await setDoc(
      doc(db, `users/${mail}/requests/${user.email}`),
      {
        mail: user.email,
        added: dt,
      },
      { merge: true }
    );

    mail = "";
  };

  const removeFriend = async (d) => {
    const idx = friends.findIndex((o) => o.mail === d);
    friends.splice(idx, 1);
    friends = friends;
    await deleteDoc(doc(db, `users/${user.email}/friends/${d}`));
    await deleteDoc(doc(db, `users/${d}/friends/${user.email}`));
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) goto("/profile");
    user = JSON.parse(sessionStorage.user);
    loading = true;
    await getFriends();
    loading = false;
  });
</script>

<div
  class="animate-fade-in-up min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull dark:border-0 flex flex-col"
>
  <div
    class="flex flex-col pb-10 justify-center text-center space-y-5 text-gray-900 dark:text-white"
  >
    {#if loading}
      <div class="flex justify-center">
        <Circle color="orange" size="3" unit="rem" />
      </div>
    {:else if friends.length > 0}
      {#key friends}
        <div>
          {#each friends as friend}
            <div
              class="animate-fade-in-up flex justify-around items-center overflow-auto min-w-full mt-3 px-4 pt-4 max-w-sm bg-gray-100 border border-gray-300 rounded-lg shadow dark:bg-lc dark:border-0"
            >
              <div class="flex flex-col py-3">
                <span
                  class="font-bold text-xs sm:text-2xl flex flex-col items-center pb-10 mr-1"
                  >{friend.mail}</span
                >
                <span class="text-xs"
                  >added <span class="font-bold"
                    >{new Date(friend.added.seconds * 1000).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                      }
                    )}</span
                  ></span
                >
              </div>
              <div>
                <p>
                  <span class="font-semibold text-lg">{ct[friend.mail]}</span> question(s)
                  tried today
                </p>
              </div>
              <div class="flex flex-col sm:flex-row sm:space-x-5">
                <button
                  on:click={() => {
                    sessionStorage.friend = friend.mail;
                    goto("/chat");
                  }}
                  type="button"
                  class="bg-violet-500 text-xs sm:text-base mb-3 hover:bg-violet-700 sm:font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full focus:outline-none focus:shadow-outline"
                  >Chat</button
                >
                <button
                  on:click={removeFriend(friend.mail)}
                  type="button"
                  class="bg-red-500 mb-3 hover:bg-red-700 sm:font-semibold px-2 sm:py-2 rounded-full focus:outline-none focus:shadow-outline"
                  ><svg
                    class="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg></button
                >
              </div>
            </div>
          {/each}
        </div>
      {/key}
    {:else}
      <h5 class="text-xl font-medium text-gray-900 text-center dark:text-white">
        NO Friends
      </h5>
    {/if}
  </div>

  <input
    type="text"
    class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline"
    placeholder="Friend's Gmail"
    bind:value={mail}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:enabled:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xs sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
    on:click={makeRequest}
    disabled={!mail.endsWith("@gmail.com") || mail.startsWith("@")}
    >Request</button
  >
</div>
