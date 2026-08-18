import { canActivateOptionalFeature, type ConsentState } from '@webtools/compliance';

export type AnalyticsEventName =
  | 'tool_view'
  | 'tool_calculate'
  | 'tool_reset'
  | 'tool_share'
  | 'related_tool_click'
  | 'print_result'
  | 'affiliate_click';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  siteKey: string;
  toolSlug?: string;
  properties?: Record<string, string | number | boolean>;
}

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
}

export const noopAnalytics: AnalyticsAdapter = {
  track: () => undefined,
};

export interface ConsentAwareAnalyticsInput {
  adapter: AnalyticsAdapter;
  enabled: boolean;
  consentRequired: boolean;
  consent: ConsentState;
}

export function consentAwareAnalytics(input: ConsentAwareAnalyticsInput): AnalyticsAdapter {
  const allowed = canActivateOptionalFeature({
    enabled: input.enabled,
    consentRequired: input.consentRequired,
    consent: input.consent,
  });
  if (!allowed) return noopAnalytics;
  return input.adapter;
}
