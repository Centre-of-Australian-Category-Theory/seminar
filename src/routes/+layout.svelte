<script>
 import "../app.css";
 
 import { page } from '$app/stores';
 import { base } from '$app/paths';
 
 let path;
 $: path = $page.url.pathname;
</script>


<div class="w-screen flex items-center justify-center px-4">
  <div class="max-w-prose mx-auto flex flex-col gap-1.5 py-5">
    <h1 class="text-3xl text-center font-semibold text-red mt-3 mb-5">Australian Category Seminar</h1>
    <div class="grid grid-cols-4 w-full text-center justify-stretch items-stretch gap-0.5">
      <a class={path.endsWith('/') ? "py-3 bg-sand font-medium" : "py-3 bg-sand-light"} href="{base}/">About</a>
      <a class={path.endsWith('recent-talks') ? "py-3 bg-sand font-medium" : "py-3 bg-sand-light"} href="{base}/recent-talks">Recent</a>
      <a class={path.endsWith('past-talks') ? "py-3 bg-sand font-medium" : "py-3 bg-sand-light"} href="{base}/past-talks">Past</a>
      <a class={path.endsWith('speakers') ? "py-3 bg-sand font-medium" : "py-3 bg-sand-light"} href="{base}/speakers">Speakers</a>
    </div>
    <slot />
  </div>
</div>
