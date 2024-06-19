<script>
 export let data;
 import { base } from '$app/paths';
</script>

<div class="bg-sand-light px-2.5 py-2 -mt-1">
  <h2><span class="font-bold text-red">{data.title}</span> {#if data.part}<span class="font-medium text-deep-red">({data.part}/{data.totalParts})</span>{/if}</h2>
  <div>
    <a class="hover:text-red" href="{base}/speakers/{encodeURIComponent(String(data.speaker))}">{data.speaker}</a><span class="mx-1" />·<span class="mx-1" />{data.humanDate}
  </div>
</div>

<div class="pt-2">
  {#if data.abstract}
    {@html data.abstract}
  {:else}
    <p><i>No abstract</i></p>
  {/if}
</div>

<div>
  <a href="javascript:history.back()" class="mt-4 bg-sand-light p-2">Back</a>
</div>
