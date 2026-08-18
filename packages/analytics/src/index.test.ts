import { describe, expect, it } from 'vitest';
import { consentAwareAnalytics, type AnalyticsEvent } from './index';

describe('analytics consent adapter', () => {
  const event: AnalyticsEvent = { name: 'tool_calculate', siteKey: 'groundexact', toolSlug: 'mulch-calculator' };

  it('forwards events when tracking is enabled and allowed', () => {
    const received: AnalyticsEvent[] = [];
    const analytics = consentAwareAnalytics({
      adapter: { track: (value) => received.push(value) },
      enabled: true,
      consentRequired: true,
      consent: 'granted',
    });
    analytics.track(event);
    expect(received).toEqual([event]);
  });

  it('suppresses events when consent is required but denied', () => {
    const received: AnalyticsEvent[] = [];
    const analytics = consentAwareAnalytics({
      adapter: { track: (value) => received.push(value) },
      enabled: true,
      consentRequired: true,
      consent: 'denied',
    });
    analytics.track(event);
    expect(received).toEqual([]);
  });
});
