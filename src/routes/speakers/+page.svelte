<script>
 import { base } from '$app/paths';
 export let data;
</script>

<div class="py-4 text-justify font-normal">
  Here is a list of all speakers at
  the Australian Category Seminar. Click on a speaker's name for
  a list of their talks.
</div>

<div class="text-left rounded-sm w-full bg-sand-light p-3">
  <div class="grid grid-cols-2 grid-flow-row gap-2 w-full">
    {#each data.speakers as speaker}
      <a class="hover:text-red" href="{base}/speakers/{encodeURIComponent(String(speaker))}">{speaker}</a>
    {/each}
  </div>
</div>
