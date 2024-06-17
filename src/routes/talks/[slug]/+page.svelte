<script>
 export let data;
</script>
<div class="bg-sand-light px-2.5 py-2 mt-2">
  <h2 class="font-bold text-red">{data.title}</h2>
  <div class="pt-1">
    <a class="hover:text-red" href="/speakers/{encodeURIComponent(String(data.speaker))}">{data.speaker}</a><span class="mx-1" />·<span class="mx-1" />{data.humanDate}
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
  <a href="javascript:history.back()" class="mt-4 rounded-md bg-sand-light p-2">Back</a>
</div>
