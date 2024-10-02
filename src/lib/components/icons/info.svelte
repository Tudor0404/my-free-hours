<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';

  export let label = 'info';
  export let colour = 'inherit';
  export let ariaHidden = false;
  export let width = 24;
  let className = "";
  export { className as class };

  /* some libraries add an id which can result in duplicate ids and that can impact accessibility so
  you can override with a random id if you face this issue */
  const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

  // https://api.iconify.design/<COLLECTION>.json?icons=<ICON>
</script>

<Icon icon="material-symbols:info-outline" aria-hidden={ariaHidden} aria-label={label} color={colour} {width} {id} class={className}/>
