<script>
 import "../app.css";
 
 import { page } from '$app/stores';
 import { base } from '$app/paths';
 let path;
 $: path = $page.url.pathname;
</script>


<div class="w-screen flex items-center justify-center">
  <div class="w-5/6 max-w-prose mx-auto flex flex-col gap-1.5 py-5">
  <h1 class="text-4xl text-center font-semibold text-red mt-3 mb-5">Australian Category Seminar</h1>
  <div class="grid grid-cols-4 w-full text-center justify-stretch items-stretch gap-0.5">
    <a class={path == "{base}/" ? "p-3 bg-sand font-medium" : "p-3 bg-sand-light"} href="{base}/">About{path}</a>
    <a class={path == "{base}/recent-talks" ? "p-3 bg-sand font-medium" : "p-3 bg-sand-light"} href="{base}/recent-talks">Recent talks</a>
    <a class={path == "{base}/past-talks" ? "p-3 bg-sand font-medium" : "p-3 bg-sand-light"} href="{base}/past-talks">Past talks</a>
    <a class={path == "{base}/speakers" ? "p-3 bg-sand font-medium" : "p-3 bg-sand-light"} href="{base}/speakers">Speakers</a>
  </div>
  <slot />
  </div>
</div>
