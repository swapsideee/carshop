import { z } from 'zod';

type EnvSource = Record<string, string | undefined>;

const requiredString = z.string().min(1);
const requiredTrimmedString = z.string().trim().min(1);
const portSchema = z.coerce.number().int().min(1).max(65535);

const dbSchema = z.object({
  DB_HOST: requiredTrimmedString,
  DB_PORT: portSchema,
  DB_USER: requiredTrimmedString,
  DB_PASS: requiredString,
  DB_NAME: requiredTrimmedString,
});

const dbRootSchema = dbSchema.extend({
  DB_ROOT_PASS: requiredString,
});

const appUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  });

const stripeSecretSchema = z.object({
  STRIPE_SECRET_KEY: requiredString,
});

const stripeCheckoutSchema = stripeSecretSchema.extend({
  APP_URL: appUrlSchema.optional(),
});

const stripeWebhookSchema = stripeSecretSchema.extend({
  STRIPE_WEBHOOK_SECRET: requiredString,
});

const emailSchema = z.object({
  EMAIL_USER: z.string().trim().email(),
  EMAIL_PASS: requiredString,
  OWNER_EMAIL: z.string().trim().email(),
});

export type DbEnv = {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
};

export type DbRootEnv = DbEnv & {
  rootPassword: string;
};

/** Complete runtime configuration consumed by checkout and session flows. */
export type StripeCheckoutEnv = {
  secretKey: string;
  appUrl: string;
  isProduction: boolean;
};

export type StripeWebhookEnv = {
  secretKey: string;
  webhookSecret: string;
};

export type EmailEnv = {
  user: string;
  password: string;
  ownerEmail: string;
};

let cachedDbEnv: DbEnv | undefined;
let cachedDbRootEnv: DbRootEnv | undefined;
let cachedStripeCheckoutEnv: StripeCheckoutEnv | undefined;
let cachedStripeWebhookEnv: StripeWebhookEnv | undefined;
let cachedEmailEnv: EmailEnv | undefined;

function parseOrThrow<TSchema extends z.ZodType>(
  schema: TSchema,
  source: EnvSource,
): z.infer<TSchema> {
  const parsed = schema.safeParse(source);

  if (parsed.success) return parsed.data;

  const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    .filter(Boolean)
    .filter((field): field is string => Boolean(field));
  throwInvalidEnvironmentVariables(fields);
}

function throwInvalidEnvironmentVariables(fields: string[]): never {
  throw new Error(`Invalid environment variables: ${fields.join(', ') || 'unknown'}`);
}

function mapDbEnv(value: z.infer<typeof dbSchema>): DbEnv {
  return {
    host: value.DB_HOST,
    port: value.DB_PORT,
    user: value.DB_USER,
    password: value.DB_PASS,
    name: value.DB_NAME,
  };
}

export function parseDbEnv(source: EnvSource): DbEnv {
  return mapDbEnv(parseOrThrow(dbSchema, source));
}

export function parseDbRootEnv(source: EnvSource): DbRootEnv {
  const value = parseOrThrow(dbRootSchema, source);

  return {
    ...mapDbEnv(value),
    rootPassword: value.DB_ROOT_PASS,
  };
}

export function parseStripeCheckoutEnv(source: EnvSource): StripeCheckoutEnv {
  const value = parseOrThrow(stripeCheckoutSchema, source);
  const isProduction = source.NODE_ENV === 'production';

  if (isProduction && !value.APP_URL) {
    throwInvalidEnvironmentVariables(['APP_URL']);
  }

  return {
    secretKey: value.STRIPE_SECRET_KEY,
    appUrl: value.APP_URL ?? 'http://localhost:3000',
    isProduction,
  };
}

export function parseStripeWebhookEnv(source: EnvSource): StripeWebhookEnv {
  const value = parseOrThrow(stripeWebhookSchema, source);

  return {
    secretKey: value.STRIPE_SECRET_KEY,
    webhookSecret: value.STRIPE_WEBHOOK_SECRET,
  };
}

export function parseEmailEnv(source: EnvSource): EmailEnv {
  const value = parseOrThrow(emailSchema, source);

  return {
    user: value.EMAIL_USER,
    password: value.EMAIL_PASS,
    ownerEmail: value.OWNER_EMAIL,
  };
}

export function getDbEnv(): DbEnv;
export function getDbEnv(options: { includeRootPassword: true }): DbRootEnv;
export function getDbEnv(options?: { includeRootPassword: true }): DbEnv | DbRootEnv {
  if (options?.includeRootPassword) {
    cachedDbRootEnv ??= parseDbRootEnv(process.env);
    return cachedDbRootEnv;
  }

  cachedDbEnv ??= parseDbEnv(process.env);
  return cachedDbEnv;
}

export function getStripeCheckoutEnv(): StripeCheckoutEnv {
  cachedStripeCheckoutEnv ??= parseStripeCheckoutEnv(process.env);
  return cachedStripeCheckoutEnv;
}

export function getStripeWebhookEnv(): StripeWebhookEnv {
  cachedStripeWebhookEnv ??= parseStripeWebhookEnv(process.env);
  return cachedStripeWebhookEnv;
}

export function getEmailEnv(): EmailEnv {
  cachedEmailEnv ??= parseEmailEnv(process.env);
  return cachedEmailEnv;
}
