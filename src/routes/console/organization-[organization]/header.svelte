<script lang="ts">
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { tooltip } from '$lib/actions/tooltip';
    import {
        AvatarGroup,
        DropList,
        DropListItem,
        DropListLink,
        Heading,
        Tab,
        Tabs
    } from '$lib/components';
    import { BillingPlan } from '$lib/constants';
    import { Pill } from '$lib/elements';
    import { Button } from '$lib/elements/forms';
    import { toLocaleDate } from '$lib/helpers/date';
    import { isTabSelected } from '$lib/helpers/load';
    import { Cover } from '$lib/layout';
    import {
        daysLeftInTrial,
        getServiceLimit,
        plansInfo,
        readOnly,
        tierToPlan
    } from '$lib/stores/billing';
    import {
        members,
        newMemberModal,
        newOrgModal,
        organization,
        organizationList
    } from '$lib/stores/organization';
    import { GRACE_PERIOD_OVERRIDE, isCloud } from '$lib/system';

    let areMembersLimited: boolean;
    $: organization.subscribe(() => {
        const limit = getServiceLimit('members') || Infinity;
        const isLimited = limit !== 0 && limit < Infinity;
        areMembersLimited =
            isCloud &&
            (($readOnly && !GRACE_PERIOD_OVERRIDE) || (isLimited && $members?.total >= limit));
    });
    let showDropdown = false;

    function createOrg() {
        showDropdown = false;
        if (isCloud) {
            goto(`${base}/console/create-organization`);
        } else newOrgModal.set(true);
    }

    $: avatars = $members.memberships?.map((m) => m.userName) ?? [];
    $: organizationId = $page.params.organization;
    $: path = `/console/organization-${organizationId}`;
    $: permanentTabSettings = [
        {
            href: `${path}/settings`,
            event: 'settings',
            title: 'Settings'
        }
    ];
    $: permanentTabs = [
        {
            href: path,
            title: 'Projects',
            event: 'projects',
            hasChildren: true
        },
        {
            href: `${path}/members`,
            title: 'Members',
            event: 'members',
            hasChildren: true
        }
    ];

    $: tabs = isCloud
        ? [
              ...permanentTabs,
              {
                  href: `${path}/usage`,
                  event: 'usage',
                  title: 'Usage',
                  hasChildren: true
              },
              {
                  href: `${path}/billing`,
                  event: 'billing',
                  title: 'Billing'
              },
              ...permanentTabSettings
          ]
        : [...permanentTabs, ...permanentTabSettings];
</script>

{#if $organization?.$id}
    <Cover>
        <svelte:fragment slot="header">
            <DropList bind:show={showDropdown} placement="bottom-end" noArrow scrollable>
                <button
                    class="button is-text u-padding-inline-0 u-max-width-100-percent"
                    on:click={() => (showDropdown = !showDropdown)}>
                    <Heading tag="h1" size="4" class="u-flex u-cross-center u-gap-8">
                        <span class="u-flex u-cross-center u-gap-8 u-min-width-0">
                            <span class="u-trim">
                                {$organization.name}
                            </span>
                            {#if isCloud && $organization?.billingPlan === BillingPlan.FREE}
                                <Pill>FREE</Pill>
                            {/if}
                            {#if isCloud && $organization?.billingTrialStartDate && $daysLeftInTrial > 0 && $organization.billingPlan !== BillingPlan.FREE && $plansInfo.get($organization.billingPlan)?.trialDays}
                                <div
                                    class="u-flex u-cross-center"
                                    use:tooltip={{
                                        content: `Your trial ends on ${toLocaleDate(
                                            $organization.billingStartDate
                                        )}. ${$daysLeftInTrial} days remaining.`
                                    }}>
                                    <Pill>TRIAL</Pill>
                                </div>
                            {/if}
                        </span>
                        <span
                            class={`icon-cheveron-${showDropdown ? 'up' : 'down'}`}
                            aria-hidden="true" />
                    </Heading>
                </button>
                <svelte:fragment slot="list">
                    {#each $organizationList.teams as org}
                        <DropListLink
                            href={`${base}/console/organization-${org.$id}`}
                            on:click={() => (showDropdown = false)}>
                            {org.name}
                        </DropListLink>
                    {/each}
                </svelte:fragment>
                <svelte:fragment slot="other">
                    <section class="drop-section">
                        <ul class="drop-list">
                            <DropListItem icon="plus" on:click={createOrg}>
                                New Organization
                            </DropListItem>
                        </ul>
                    </section></svelte:fragment>
            </DropList>
            <div class="u-margin-inline-start-auto">
                <div class="u-flex u-gap-16 u-cross-center">
                    <a href={`${path}/members`} class="is-not-mobile">
                        <AvatarGroup size={40} {avatars} total={$members?.total ?? 0} />
                    </a>
                    <div
                        use:tooltip={{
                            content:
                                $organization?.billingPlan === BillingPlan.FREE
                                    ? `Upgrade to add more members`
                                    : `You've reached the members limit for the ${
                                          tierToPlan($organization?.billingPlan)?.name
                                      } plan`,
                            disabled: !areMembersLimited
                        }}>
                        <Button
                            secondary
                            on:click={() => newMemberModal.set(true)}
                            disabled={areMembersLimited}>
                            <span class="icon-plus" aria-hidden="true" />
                            <span class="text">Invite</span>
                        </Button>
                    </div>
                </div>
            </div></svelte:fragment>
        <Tabs>
            {#each tabs as tab}
                <Tab
                    href={tab.href}
                    selected={isTabSelected(tab, $page.url.pathname, path, tabs)}
                    event={tab.event}>
                    {tab.title}
                </Tab>
            {/each}
        </Tabs>
    </Cover>
{/if}
