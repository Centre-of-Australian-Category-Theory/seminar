<script>
 export let data;
</script>

<div class="py-4">
  Here is a list of talks given over the past twelve months at the
  Australian Category Seminar. Click on a speaker's name for their
  other talks.
</div>

<div class="flex flex-col gap-1">
  {#each Object.keys(data.grouped) as date}
    <div class="rounded w-full bg-sand-light px-2.5 py-2">
      <div class="mb-1 text-red font-bold">{date}</div>
      <ul class="flex flex-col gap-0.5">
        {#each data.grouped[date] as talk}
          <li class="grid grid-cols-4 w-full">
            <a class="pr-2 hover:text-red" href="{base}/speakers/{encodeURIComponent(String(talk.speaker))}">{talk.speaker}</a>
            <div class="col-span-3 text-pretty">
              <div class="col-span-3 text-pretty">
                {talk.title}{#if talk.part}, part {talk.part}{/if}
                {#if talk.abstract}
                  <a class="text-deep-red hover:text-red" href="{base}/talks/{talk.abstract}">(abstract)</a>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
