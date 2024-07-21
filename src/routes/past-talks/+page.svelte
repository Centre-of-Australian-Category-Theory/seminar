<script>
 export let data;
 import { base } from '$app/paths';
 import { writable } from 'svelte/store';
 import { browser } from "$app/environment"
 
 var years = Object.keys(data.grouped).reverse();

 function toggleYear(n) {
   $currentYear = n;
 }
 function setAll() {
   $currentYear = "All";
 }

 const currentYear = writable((browser && sessionStorage.getItem("currentYear") && JSON.parse(sessionStorage.getItem("currentYear"))) || years[0]);
 currentYear.subscribe(val => {if (browser) sessionStorage.setItem("currentYear", JSON.stringify(val))});
</script>

<div class="grid grid-cols-12 sm:grid-cols-16 -mt-1 gap-0.5">
  {#each years.toReversed() as year}
    <a class="py-1 text-center text-sm {$currentYear == year ? 'bg-red text-sand' : 'bg-sand-light'}"
       href="javascript:void(0);"
       on:click={() => toggleYear(year)}>
      {String(year%100).padStart(2,'0')}
    </a>
  {/each}
  <a class="py-1 text-center text-sm {$currentYear == 'All' ? 'bg-red text-sand' : 'bg-sand-light'}"
     href="javascript:void(0);"
     on:click={() => setAll()}>
    All
  </a>
</div>

<div class="py-4">
  Here is a list of past talks given at the Australian Category
  Seminar. Use the buttons to choose a year. Click on a speaker's name
  for their other talks.
</div>

{#each years as year}
  {#if $currentYear == year || $currentYear == 'All'}
    <h2 class="bg-sand px-2.5 py-2 font-bold text-lg">{year}</h2>
    <div class="flex flex-col gap-0.5 -mt-1">
    {#each Object.keys(data.grouped[year]) as date}
      <div class="w-full bg-sand-light px-2.5 py-2">
        <div class="mb-1 text-red font-bold">{date}</div>
        <ul class="flex flex-col gap-0.5">
          {#each data.grouped[year][date] as talk}
            <li class="grid grid-cols-5 sm:grid-cols-4 w-full">
              <a class="pr-2 col-span-2 sm:col-span-1 hover:text-red" href="{base}/speakers/{encodeURIComponent(String(talk.speaker))}">
                {talk.speaker}
              </a>
              <div class="col-span-3 text-pretty">
                {talk.title}{#if talk.part}<span class="text-gray-500 pl-1">({talk.part}/{talk.totalParts})</span>{/if}
                {#if talk.abstract}
                  <a class="text-deep-red hover:text-red" href="{base}/talks/{talk.abstract}">(abs)</a>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
    </div>
  {/if}
{/each}
