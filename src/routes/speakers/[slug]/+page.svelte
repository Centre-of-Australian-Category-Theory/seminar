<script>
 export let data;
</script>

<div class="py-4 text-justify">
  Here is a list of all talks by {data.speaker} at the Australian
  Category Seminar. 
</div>

<div class="flex flex-col gap-1">
  {#each Object.keys(data.talks).reverse() as date}
    <div class="rounded w-full bg-sand-light px-2.5 py-2">
      <div class="mb-1 text-red"><b>{date}</b></div>
      <ul class="flex flex-col gap-0.5">
        {#each data.talks[date] as talk}
          <li class="grid grid-cols-5 w-full">
            <div class="pr-2">{talk.date}</div>
            <div class="col-span-4 text-pretty">
              {#if talk.previous && data.dates[talk.previous]}
                <i class="text-gray-500">continued from {data.dates[talk.previous]} {#if data.years[talk.previous] != date} {data.years[talk.previous]}{/if}</i>
              {:else}
                {talk.title}
              {/if}
              {#if talk.abstract}
                <a class="text-deep-red hover:text-red" href="/talks/{talk.id}">(abstract)</a>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
