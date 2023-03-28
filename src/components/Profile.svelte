<script>
  import { user } from "../stores";
</script>

<div
  class="w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  <div class="flex flex-col items-center pb-10">
    {#if $user}
      <img
        alt="avatar"
        class="w-24 h-24 mb-3 rounded-full shadow-lg"
        src={$user.photoURL}
      />
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        {$user.displayName}
      </h5>
      <span class="text-sm text-gray-500 dark:text-gray-400">{$user.email}</span
      >
    {/if}
  </div>
</div>
