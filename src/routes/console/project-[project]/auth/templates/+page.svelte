<script context="module" lang="ts">
    export async function loadEmailTemplate(projectId: string, type: string, locale: string) {
        try {
            // TODO: fix TemplateType and TemplateLocale typing once SDK is updated
            return await sdk.forConsole.projects.getEmailTemplate(
                projectId,
                type as EmailTemplateType,
                locale as EmailTemplateLocale
            );
        } catch (e) {
            addNotification({
                type: 'error',
                message: e.message
            });
        }
    }
    export async function loadSmsTemplate(projectId: string, type: string, locale: string) {
        try {
            // TODO: fix TemplateType and TemplateLocale typing once SDK is updated
            return await sdk.forConsole.projects.getSmsTemplate(
                projectId,
                type as SmsTemplateType,
                locale as SmsTemplateLocale
            );
        } catch (e) {
            addNotification({
                type: 'error',
                message: e.message
            });
        }
    }
</script>

<script lang="ts">
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { Alert, CardGrid, Collapsible, CollapsibleItem, Heading } from '$lib/components';
    import { Container } from '$lib/layout';
    import { sdk } from '$lib/stores/sdk';
    import { project } from '../../store';
    import { addNotification } from '$lib/stores/notifications';
    import { onMount } from 'svelte';
    import EmailVerificationTemplate from './emailVerificationTemplate.svelte';
    import EmailMagicUrlTemplate from './emailMagicUrlTemplate.svelte';
    import EmailRecoveryTemplate from './emailRecoveryTemplate.svelte';
    import EmailInviteTemplate from './emailInviteTemplate.svelte';
    // import SmsVerificationTemplate from './smsVerificationTemplate.svelte';
    // import SmsLoginTemplate from './smsLoginTemplate.svelte';
    // import { baseEmailTemplate, baseSmsTemplate, emailTemplate, smsTemplate } from './store';
    import { baseEmailTemplate, emailTemplate } from './store';
    import { Button } from '$lib/elements/forms';
    import { organization } from '$lib/stores/organization';
    import { BillingPlan } from '$lib/constants';
    import type {
        SmsTemplateLocale,
        SmsTemplateType,
        EmailTemplateType,
        EmailTemplateLocale
    } from '@appwrite.io/console';
    import Email2FaTemplate from './email2FATemplate.svelte';
    import { tierToPlan } from '$lib/stores/billing';

    const projectId = $page.params.project;

    let emailOpen = 'verification';
    $: emailVerificationOpen = emailOpen === 'verification';
    $: emailMagicSessionOpen = emailOpen === 'magicSession';
    $: emailResetPassword = emailOpen === 'recovery';
    $: emailInviteUser = emailOpen === 'invitation';
    $: email2FAVerificationOpen = emailOpen === 'mfaChallenge';

    // let smsOpen = 'verification';
    // $: smsVerificationOpen = smsOpen === 'verification';
    // $: smsLoginOpen = smsOpen === 'login';
    // $: smsInvitationOpen = smsOpen === 'invitation';

    onMount(async () => {
        openEmail('verification');
        // openSms('verification');
    });

    async function openEmail(type: string) {
        type === emailOpen ? (emailOpen = null) : (emailOpen = type);
        $emailTemplate = await loadEmailTemplate(projectId, type, 'en');
        $baseEmailTemplate = { ...$emailTemplate };
    }

    // async function openSms(type: string) {
    //     type === smsOpen ? (smsOpen = null) : (smsOpen = type);
    //     $smsTemplate = await loadSmsTemplate(projectId, type, 'en');
    //     $baseSmsTemplate = { ...$smsTemplate };
    // }
</script>

<Container>
    <div class="u-flex u-gap-8 u-cross-center">
        <Heading tag="h2" size="5">Templates</Heading>
        <div class="tag eyebrow-heading-3">
            <span class="text u-x-small">Experimental</span>
        </div>
    </div>

    {#if !$project.smtpEnabled}
        <div class="u-margin-block-start-24">
            <Alert
                isStandalone
                dismissible={false}
                type="info"
                buttons={[
                    {
                        slot: 'SMTP settings',
                        href: `${base}/console/project-${$project.$id}/settings/smtp`
                    }
                ]}>
                <svelte:fragment slot="title">
                    Custom SMTP server is required for customizing emails
                </svelte:fragment>
                Configure a custom SMTP server to enable custom email templates and prevent emails from
                being labeled as spam.
            </Alert>
        </div>
    {/if}

    <CardGrid>
        <Heading size="7" tag="h3">Email templates</Heading>
        <p class="text">
            Use templates to send and process account management emails. <a
                href="https://appwrite.io/docs/advanced/platform/message-templates"
                class="link">
                Learn more about email templates.
            </a>
        </p>

        <svelte:fragment slot="aside">
            {#if $organization.billingPlan === BillingPlan.FREE}
                <Alert
                    buttons={[
                        {
                            slot: 'Upgrade plan',
                            href: `${base}/console/organization-${$organization.$id}/billing`
                        }
                    ]}>
                    All emails sent using the {tierToPlan(BillingPlan.FREE).name} plan will include attribution
                    to Appwrite in the signature. To send attribution-free emails, upgrade your plan.
                </Alert>
            {/if}
            <Collapsible>
                <CollapsibleItem
                    bind:open={emailVerificationOpen}
                    on:click={(e) => {
                        // preventing default and propagation to open the collapsible correctly
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        openEmail('verification');
                    }}>
                    <svelte:fragment slot="title">Verification</svelte:fragment>
                    <p class="text">
                        Send a verification email to users that sign in with their email and
                        password.
                    </p>
                    <EmailVerificationTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={emailMagicSessionOpen}
                    on:click={(e) => {
                        e.preventDefault();
                        openEmail('magicSession');
                    }}>
                    <svelte:fragment slot="title">Magic URL</svelte:fragment>
                    <p class="text">Send an email to users that sign in with a magic URL.</p>
                    <EmailMagicUrlTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={emailResetPassword}
                    on:click={(e) => {
                        e.preventDefault();
                        openEmail('recovery');
                    }}>
                    <svelte:fragment slot="title">Reset password</svelte:fragment>
                    <p class="text">Send a recovery email to users that forget their password.</p>
                    <EmailRecoveryTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={emailInviteUser}
                    on:click={(e) => {
                        e.preventDefault();
                        openEmail('invitation');
                    }}>
                    <svelte:fragment slot="title">Invite user</svelte:fragment>
                    <p class="text">Send an invitation email to become a member of your project.</p>
                    <EmailInviteTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={email2FAVerificationOpen}
                    on:click={(e) => {
                        e.preventDefault();
                        openEmail('mfaChallenge');
                    }}>
                    <svelte:fragment slot="title">2FA verification</svelte:fragment>
                    <p class="text">Send a two-factor authentication email to a user.</p>
                    <Email2FaTemplate />
                </CollapsibleItem>
            </Collapsible>
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <Button href={`${base}/console/project-${$project.$id}/settings/smtp`} secondary>
                SMTP settings
            </Button>
        </svelte:fragment>
    </CardGrid>

    <!-- <CardGrid>
        <Heading size="7" tag="h3">SMS templates</Heading>
        <p class="text">
            Use templates to send and process account management mobile messages. <a
                href="https://appwrite.io/docs/advanced/platform/message-templates"
                class="link">
                Learn more about SMS templates</a
        </p>

        <svelte:fragment slot="aside">
            <Collapsible>
                <CollapsibleItem
                    bind:open={smsVerificationOpen}
                    on:click={(e) => {
                        e.preventDefault();
                        openSms('verification');
                    }}>
                    <svelte:fragment slot="title">Verification</svelte:fragment>
                    <p class="text">
                        Send a verification SMS to users that sign in with their phone
                    </p>
                    <SmsVerificationTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={smsLoginOpen}
                    on:click={(e) => {
                        e.preventDefault();
                        openSms('login');
                    }}>
                    <svelte:fragment slot="title">Login</svelte:fragment>
                    <p class="text">
                        Send a one-time passcode to users' mobile phones to allow them to sign in.
                    </p>
                    <SmsLoginTemplate />
                </CollapsibleItem>
                <CollapsibleItem
                    bind:open={smsInvitationOpen}
                    on:click={(e) => {
                        e.preventDefault();
                        openSms('invitation');
                    }}>
                    <svelte:fragment slot="title">Invitation</svelte:fragment>
                    <p class="text">Send an invitation SMS to become a member of your project.</p>
                    <SmsLoginTemplate />
                </CollapsibleItem>
            </Collapsible>
        </svelte:fragment>
    </CardGrid>-->
</Container>
