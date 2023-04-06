<script>
  import {
    collection,
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
      f.push(doc.data().mail);
    });
    friends = f;
  };

  const addFriend = async () => {
    friends = [...friends, mail];
    await setDoc(
      doc(db, `users/${user.email}/friends/${mail}`),
      {
        mail: mail,
        added: new Date(),
      },
      { merge: true }
    );
  };

  onMount(async () => {
    user = JSON.parse(sessionStorage.user);
    await getFriends();
  });
</script>

<div
  class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <div class="flex flex-col items-center pb-10 space-y-5 text-white">
    {#key friends}
      <ul>
        {#each friends as friend}
          <li>{friend}</li>
        {/each}
      </ul>
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
