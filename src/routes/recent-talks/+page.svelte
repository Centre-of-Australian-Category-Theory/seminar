<script>
 export let data;
 import { base } from '$app/paths';
</script>

<div class="py-4">
  Here is a list of talks given over the past twelve months at the
  Australian Category Seminar. Click on a speaker's name for their
  other talks.
</div>

<div class="flex flex-col gap-0.5">
  {#each Object.keys(data) as date}
    <div class="w-full bg-sand-light px-2.5 py-2">
      <div class="mb-1 text-red font-bold">{date}</div>
      <ul class="flex flex-col gap-0.5">
        {#each data[date] as talk}
          <li class="grid grid-cols-5 sm:grid-cols-7 w-full">
            <a class="pr-2 col-span-2 hover:text-red" href="{base}/speakers/{encodeURIComponent(String(talk.speaker))}">
              {talk.speaker}
            </a>
            <div class="col-span-3 sm:col-span-5 text-pretty">
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
