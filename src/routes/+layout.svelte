<script>
 import "../app.css";
 
 import { page } from '$app/stores';
 let path;
 $: path = $page.url.pathname;
</script>


<div class="w-5/6 max-w-prose mx-auto flex flex-col gap-1.5 py-5">
  <h1 class="text-4xl text-center font-semibold text-red mt-3 mb-5">Australian Category Seminar</h1>
  <div class="grid grid-cols-4 w-full text-center justify-stretch items-stretch bg-sand-light">
    <a class={path === "/" ? "p-3 bg-sand font-medium" : "p-3"} href="/">About</a>
    <a class={path === "/recent-talks" ? "p-3 bg-sand font-medium" : "p-3"} href="/recent-talks">Recent talks</a>
    <a class={path === "/past-talks" ? "p-3 bg-sand font-medium" : "p-3"} href="/past-talks">Past talks</a>
    <a class={path === "/speakers" ? "p-3 bg-sand font-medium" : "p-3"} href="/speakers">Speakers</a>
  </div>
  <slot />
</div>
