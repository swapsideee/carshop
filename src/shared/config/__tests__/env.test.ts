import { describe, expect, it } from 'vitest';

import {
  parseDbEnv,
  parseDbRootEnv,
  parseEmailEnv,
  parseStripeCheckoutEnv,
  parseStripeWebhookEnv,
} from '../env';

const databaseSource = {
  DB_HOST: ' 127.0.0.1 ',
  DB_PORT: '3307',
  DB_USER: ' carshop ',
  DB_PASS: 'database-password',
  DB_NAME: ' carshop ',
};

describe('environment configuration', () => {
  it('normalizes database configuration once at the config boundary', () => {
    expect(parseDbEnv(databaseSource)).toEqual({
      host: '127.0.0.1',
      port: 3307,
      user: 'carshop',
      password: 'database-password',
      name: 'carshop',
    });

    expect(parseDbRootEnv({ ...databaseSource, DB_ROOT_PASS: 'root-password' })).toMatchObject({
      rootPassword: 'root-password',
    });
  });

  it('reports invalid environment variable names without exposing values', () => {
    const source = { ...databaseSource, DB_PORT: 'not-a-port', DB_PASS: 'do-not-expose-me' };

    expect(() => parseDbEnv(source)).toThrow('Invalid environment variables: DB_PORT');

    try {
      parseDbEnv(source);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toContain(source.DB_PASS);
    }
  });

  it('keeps Stripe checkout independent from webhook configuration', () => {
    expect(
      parseStripeCheckoutEnv({
        STRIPE_SECRET_KEY: 'sk_test_checkout',
        APP_URL: 'https://shop.example',
        NODE_ENV: 'production',
      }),
    ).toEqual({
      secretKey: 'sk_test_checkout',
      appUrl: 'https://shop.example',
      isProduction: true,
    });

    expect(() => parseStripeWebhookEnv({ STRIPE_SECRET_KEY: 'sk_test_webhook' })).toThrow(
      'Invalid environment variables: STRIPE_WEBHOOK_SECRET',
    );
  });

  it('uses the local checkout URL only outside production', () => {
    expect(parseStripeCheckoutEnv({ STRIPE_SECRET_KEY: 'sk_test_checkout' })).toMatchObject({
      appUrl: 'http://localhost:3000',
      isProduction: false,
    });

    expect(() => {
      parseStripeCheckoutEnv({
        STRIPE_SECRET_KEY: 'sk_test_checkout',
        NODE_ENV: 'production',
      });
    }).toThrow('Invalid environment variables: APP_URL');
  });

  it('keeps Stripe webhook independent from checkout-only application URL configuration', () => {
    expect(
      parseStripeWebhookEnv({
        STRIPE_SECRET_KEY: 'sk_test_webhook',
        STRIPE_WEBHOOK_SECRET: 'whsec_test_webhook',
        APP_URL: 'not-a-url',
      }),
    ).toEqual({
      secretKey: 'sk_test_webhook',
      webhookSecret: 'whsec_test_webhook',
    });
  });

  it('validates email integration only when its configuration is requested', () => {
    expect(
      parseEmailEnv({
        EMAIL_USER: 'shop@example.com',
        EMAIL_PASS: 'email-password',
        OWNER_EMAIL: 'owner@example.com',
      }),
    ).toEqual({
      user: 'shop@example.com',
      password: 'email-password',
      ownerEmail: 'owner@example.com',
    });
  });
});
