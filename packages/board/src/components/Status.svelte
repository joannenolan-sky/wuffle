<script>
  export let state;
  export let onClick;

  $: pending = state === 'pending';
  $: success = state === 'success';
  $: failure = state === 'failure';
  $: onClick = onClick || '';
</script>



{#if pending}
<svg width="60" height="5" class:pending={ pending } class:success={ success } class:failure={ failure }>
  <line x1="0" y1="0" x2="60" y2="0" stroke="#f7d643" stroke-width="10"/>
</svg>
{:else if success}
<svg width="60" height="5" class:pending={ pending } class:success={ success } class:failure={ failure }>
  <line x1="0" y1="0" x2="60" y2="0" stroke="#19692c" stroke-width="10"/>
</svg>
{:else if failure}
<svg width="60" height="5" class:pending={ pending } class:success={ success } class:failure={ failure }>
  <line x1="0" y1="0" x2="60" y2="0" stroke="#b21f2d" stroke-width="10"/>
</svg>
{/if}
