<script>
  import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";

  let mail = "",
    friends = [],
    user = null;

  const getFriends = async () => {
    const collec = await getDocs(
      query(collection(db, `users/${user.email}/friends`), orderBy("added"))
    );
    const f = [];
    collec.forEach((doc) => {
      const data = doc.data();
      f.push({ mail: data.mail, added: data.added });
    });
    friends = f;
  };

  const addFriend = async () => {
    const dt = new Date();
    friends = [...friends, { mail: mail, added: { seconds: dt / 1000 } }];
    await setDoc(
      doc(db, `users/${user.email}/friends/${mail}`),
      {
        mail: mail,
        added: dt,
      },
      { merge: true }
    );
  };

  const removeFriend = async (d) => {
    const idx = friends.findIndex((o) => o.mail === d);
    friends.splice(idx, 1);
    friends = friends;
    await deleteDoc(doc(db, `users/${user.email}/friends/${d}`));
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    user = JSON.parse(sessionStorage.user);
    await getFriends();
  });
</script>

<div
  class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <div class="flex flex-col pb-10 space-y-5 text-white">
    {#key friends}
      <div>
        {#each friends as friend}
          <div
            class="flex justify-between items-center min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex flex-col py-3">
              <span
                class="font-bold text-2xl flex flex-col items-center pb-10 space-y-5"
                >{friend.mail}</span
              >
              <span class="text-xs"
                >added <span class="font-bold"
                  >{new Date(friend.added.seconds * 1000).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )}</span
                ></span
              >
            </div>
            <button
              on:click={removeFriend(friend.mail)}
              type="button"
              class="bg-red-500 mb-3 hover:bg-red-700 font-semibold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              >Remove</button
            >
          </div>
        {/each}
      </div>
    {/key}
  </div>

  <input
    type="text"
    class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Friend's Gmail"
    bind:value={mail}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    on:click={addFriend}>Add</button
  >
</div>
