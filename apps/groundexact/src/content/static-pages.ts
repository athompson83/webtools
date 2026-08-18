import { siteConfig } from '../../site.config';

export interface StaticSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  eyebrow?: string;
  sections: StaticSection[];
}

const contactEmail = siteConfig.legal.contactEmail;
const privacyEmail = siteConfig.legal.privacyEmail;

export const staticPages: StaticPage[] = [
  {
    slug: 'about',
    title: 'About GroundExact',
    description: 'Learn why GroundExact builds practical outdoor project calculators and how we approach useful, transparent estimates.',
    eyebrow: 'About',
    sections: [
      { heading: 'Built for decisions, not just arithmetic', paragraphs: ['GroundExact turns project measurements into practical purchase quantities. Our calculators are designed to show the underlying math, identify assumptions, and help you translate an estimate into something you can use while planning or shopping.'] },
      { heading: 'What we do differently', bullets: ['Keep formulas visible and understandable.', 'Separate calculated need from waste-adjusted and supplier-rounded quantities.', 'Ask for supplier- or product-specific values when those values are not universal.', 'Publish review dates and methodology instead of hiding assumptions.'] },
      { heading: 'Contact', paragraphs: [`Questions, corrections, or partnership inquiries can be sent to ${contactEmail}.`] },
    ],
  },
  {
    slug: 'methodology',
    title: 'Calculation Methodology',
    description: 'How GroundExact calculates project quantities, handles waste, supplier packaging, assumptions, and rounding.',
    eyebrow: 'Methodology',
    sections: [
      { heading: 'Calculation sequence', paragraphs: ['Most GroundExact tools follow the same sequence: measure the project, calculate the mathematical requirement, apply an explicit waste or overage factor when appropriate, and then convert the result into a practical purchase quantity.'] },
      { heading: 'No hidden universal rates', paragraphs: ['Material density, product application rates, package coverage, block dimensions, pallet coverage, and similar values vary by product and supplier. When a value is not reasonably universal, GroundExact asks you to enter the value shown by the manufacturer or supplier rather than silently assuming one.'] },
      { heading: 'Rounding', paragraphs: ['Mathematical results may contain fractions. Purchase recommendations round upward only where the product or supplier requires whole packages or order increments. The unrounded calculated requirement remains visible so you can see the difference.'] },
      { heading: 'Field conditions matter', paragraphs: ['Compaction, settlement, slopes, irregular geometry, cuts, breakage, installation technique, local requirements, and supplier tolerances can change real-world needs. Calculator outputs are planning estimates, not engineering or professional advice.'] },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact GroundExact',
    description: 'Contact GroundExact about calculator corrections, general questions, accessibility, privacy, advertising, or partnerships.',
    eyebrow: 'Contact',
    sections: [
      { heading: 'General questions', paragraphs: [`Email ${contactEmail} for calculator feedback, correction requests, advertising questions, or general inquiries.`] },
      { heading: 'Privacy requests', paragraphs: [`For privacy-related questions or requests, email ${privacyEmail}.`] },
      { heading: 'Calculator corrections', paragraphs: ['If you believe a calculator is producing an incorrect result, include the tool name, the inputs you used, the result you received, and what you expected. That gives us enough information to reproduce and investigate the issue.'] },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'GroundExact privacy policy describing information handling, analytics, advertising, cookies, third parties, and privacy requests.',
    eyebrow: 'Legal',
    sections: [
      { heading: 'Overview', paragraphs: ['GroundExact is designed so its core calculators can work without creating an account or storing a personal project profile. This policy describes information that may be processed when you use the site and will be updated if our data practices materially change.'] },
      { heading: 'Information you provide', paragraphs: [`If you contact us, we may receive the information you include in the message, such as your email address and the contents of your request. Privacy questions can be sent to ${privacyEmail}.`] },
      { heading: 'Calculator inputs', paragraphs: ['Core calculator inputs are intended to be processed in your browser. Do not enter personal, confidential, health, financial-account, or other sensitive information into calculator fields.'] },
      { heading: 'Analytics and advertising', paragraphs: ['GroundExact may use analytics and advertising technologies after they are configured and appropriately disclosed. When enabled, those providers may process device, browser, referral, page-interaction, cookie, or similar identifiers according to their own terms and applicable consent requirements. The live site should not claim a provider is active until the site configuration actually enables it.'] },
      { heading: 'Cookies and local storage', paragraphs: ['Cookies or similar browser storage may be used for consent choices, analytics, advertising, or site preferences when those features are enabled. See the Cookie Policy for additional information.'] },
      { heading: 'Data sharing', paragraphs: ['We may share information with service providers that help operate, secure, measure, or monetize the site, or when required by law. We do not describe a data practice as active unless the corresponding service is actually configured.'] },
      { heading: 'Your choices', paragraphs: [`You may contact ${privacyEmail} with questions about applicable privacy rights. Rights vary by location and may include access, correction, deletion, or choices concerning certain advertising or data-sharing practices.`] },
      { heading: 'Changes', paragraphs: ['We may update this policy when our services, providers, or legal obligations change. The production version should display a last-updated date once legal review is complete.'] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    description: 'Terms governing use of GroundExact calculators, estimates, site content, and third-party links.',
    eyebrow: 'Legal',
    sections: [
      { heading: 'Use of the site', paragraphs: ['GroundExact provides informational calculators and planning tools. You may use the site for lawful personal or business planning purposes subject to these terms.'] },
      { heading: 'Estimates, not professional advice', paragraphs: ['Calculator outputs are estimates based on the inputs and assumptions provided. GroundExact does not provide engineering, architectural, construction, legal, financial, safety, agricultural, or other licensed professional advice. Verify important quantities, local requirements, installation specifications, and product instructions before purchasing or beginning work.'] },
      { heading: 'No guarantee of supplier availability or price', paragraphs: ['Packaging, dimensions, material density, application rates, prices, availability, order increments, and specifications vary by manufacturer, supplier, region, and time. Supplier- or product-specific information should be confirmed before purchase.'] },
      { heading: 'Third-party links', paragraphs: ['The site may link to retailers, manufacturers, advertisers, affiliates, or other third parties. GroundExact is not responsible for third-party content, products, transactions, policies, or availability.'] },
      { heading: 'Acceptable use', bullets: ['Do not interfere with site operation or security.', 'Do not use automated access in a manner that materially degrades service for others.', 'Do not misrepresent GroundExact outputs as professional certifications or guarantees.'] },
      { heading: 'Limitation', paragraphs: ['To the extent permitted by applicable law, use of the site and reliance on calculator outputs is at your own risk. Final production terms should be reviewed for the legal entity, governing law, limitation-of-liability language, and dispute provisions before monetized launch.'] },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'How GroundExact may use cookies and similar technologies for essential preferences, analytics, advertising, and consent.',
    eyebrow: 'Legal',
    sections: [
      { heading: 'What these technologies are', paragraphs: ['Cookies, local storage, and similar technologies allow a browser or service provider to retain small pieces of information between requests or visits.'] },
      { heading: 'How GroundExact may use them', bullets: ['Remembering consent choices.', 'Measuring site usage when analytics are enabled.', 'Supporting advertising when advertising is enabled.', 'Maintaining limited site preferences where useful.'] },
      { heading: 'Consent', paragraphs: ['Where consent is legally required, optional analytics or advertising technologies should not be activated until the appropriate consent signal is obtained. The deployed consent platform and provider list must match the live site configuration.'] },
      { heading: 'Controls', paragraphs: ['Browser settings can generally remove or block cookies. A production consent interface should also provide controls required for the jurisdictions and advertising products in use.'] },
    ],
  },
  {
    slug: 'advertising-disclosure',
    title: 'Advertising & Affiliate Disclosure',
    description: 'How advertising, affiliate relationships, and sponsored placements may support GroundExact.',
    eyebrow: 'Disclosure',
    sections: [
      { heading: 'How the site may earn money', paragraphs: ['GroundExact may display advertising and may use affiliate links to relevant products or services. We may earn revenue when an advertisement is viewed or interacted with, or when a qualifying transaction occurs through an affiliate link.'] },
      { heading: 'Editorial and calculation independence', paragraphs: ['Advertising or affiliate compensation should not change the mathematical formula of a calculator. Paid relationships, sponsored placements, and affiliate links should be identified in a way that is understandable to users.'] },
      { heading: 'No price guarantee', paragraphs: ['Prices, promotions, availability, and product specifications on third-party sites can change without notice. Verify all purchase information with the seller.'] },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    description: 'GroundExact accessibility commitment and how to report barriers using the calculators or site content.',
    eyebrow: 'Accessibility',
    sections: [
      { heading: 'Our approach', paragraphs: ['GroundExact aims to provide keyboard-accessible controls, clear labels, sufficient contrast, readable focus states, semantic page structure, and calculator results that do not rely on color alone.'] },
      { heading: 'Report a barrier', paragraphs: [`If you have difficulty using a calculator or accessing content, email ${contactEmail} with the page, device or browser if known, and a description of the barrier.`] },
      { heading: 'Continuous review', paragraphs: ['Accessibility is treated as a release and regression requirement, not a one-time checklist. Automated testing should be supplemented by keyboard and screen-reader-oriented review of core flows.'] },
    ],
  },
];

export function getStaticPage(slug: string): StaticPage | undefined {
  return staticPages.find((page) => page.slug === slug);
}
