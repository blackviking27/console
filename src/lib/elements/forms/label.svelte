<script lang="ts">
    import { tooltip as tooltipAction } from '$lib/actions/tooltip';

    interface $$Props extends Partial<HTMLLabelElement> {
        required?: boolean;
        hideRequired?: boolean;
        optionalText?: string | undefined;
        hide?: boolean;
        tooltip?: string;
        for?: string;
        class?: string;
    }

    export let required: $$Props['required'] = false;
    export let hideRequired: $$Props['hideRequired'] = false;
    export let optionalText: $$Props['optionalText'] = undefined;
    export let hide: $$Props['hide'] = false;
    export let tooltip: $$Props['tooltip'] = null;
</script>

<label
    class:is-required={required && !hideRequired}
    class:u-hide={hide}
    class="label"
    {...$$restProps}>
    <slot />
</label>

{#if optionalText}
    <span class="optional u-margin-inline-start-8">{optionalText}</span>
{/if}

{#if tooltip}
    <button
        type="button"
        on:click|preventDefault
        class="tooltip"
        aria-label="input tooltip"
        use:tooltipAction={{ content: tooltip }}>
        <span class="icon-info" aria-hidden="true" style="font-size: var(--icon-size-small)" />
    </button>
{/if}
