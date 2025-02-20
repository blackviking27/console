//campaign welcome and startup

type CampaignData = {
    title: string;
    description: string;
};

export const campaigns: Map<string, CampaignData> = new Map();

campaigns
    .set('welcome', {
        title: "You've received $VALUE in credits",
        description:
            'Get $VALUE in credits when you upgrade or create an organization with a Pro plan.'
    })
    .set('startup', {
        title: 'Welcome to the Startups program!',
        description:
            "We're excited to have you on board. Add the coupon code to your Appwrite Pro account to join."
    })
    .set('RenderATL2024', {
        title: 'Claim your $100 RenderATL credits',
        description:
            'Get $100 in Cloud credits when you upgrade or create an organization with a Pro plan.'
    })
    .set('dealsfordevs', {
        title: 'Claim your $50 Deals For Devs credits',
        description:
            'Get $50 in Cloud credits when you upgrade or create an organization with a Pro plan.'
    })
    .set('WelcomeManual', {
        title: 'Here is your $VALUE welcome credit!',
        description:
            'Upgrade to Appwrite Pro and add the credits to enjoy the full capabilities of Cloud.'
    })
    .set('InactiveAccounts', {
        title: 'Get everything out of Cloud. Claim your $VALUE credits.',
        description:
            'Get $VALUE in Cloud credits when you upgrade or create an organization with a Pro plan.'
    });
