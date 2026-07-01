export type WizardProgressData = {
  name: string;
  email: string;
  fundraisingNeeds: string[];
  role: string;
  company: string;
  city: string;
  website: string;
  sector: string;
  segment: string;
  businessDescription: string;
  priorFunding: string;
  hadExit: string;
  stage: string;
  raise: string;
  traction: string;
  timeline: string;
  priorOutreach: string;
};

export type WizardProgressPayload = {
  step: number;
  data: WizardProgressData;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  triggerEarlyAlert?: boolean;
};

export type WizardProgressResponse = {
  ok: true;
  resumeToken: string;
  step: number;
  data: WizardProgressData;
  earlyAlertSent?: boolean;
};
