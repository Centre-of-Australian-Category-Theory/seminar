<script>
 export let data;
 import { base } from '$app/paths';
</script>

{#each data.ids as id}
  <a href="{base}/talks/{id}">Link</a>
{/each}
