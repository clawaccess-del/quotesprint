import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import Stripe from 'stripe';

const secretsPath = '/data/.openclaw/credentials/user-secrets.json';
const root = '/data/.openclaw/workspace/projects/quotesprint';
const siteUrl = 'https://quotesprint.vercel.app';
const data = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
const stripeSecret = data.tokens.stripe.secretKey;
const vercelToken = data.tokens.vercel.token;
const stripe = new Stripe(stripeSecret);

const items = [
  ['starter', 'QuoteSprint Starter Kit', 2900, 'Templates, quote builder, SMS/email scripts, lead response checklist, and estimate confidence calculator.'],
  ['pro', 'QuoteSprint Pro Kit', 7900, 'Full QuoteSprint workflow kit with deposit language, objection handling, job-type prompts, and campaign calendar.'],
  ['agency', 'QuoteSprint Agency License', 19900, 'Commercial usage license with client onboarding, white-label guidance, and multi-client templates.'],
];

const priceIds = {};
for (const [key, name, amount, description] of items) {
  const product = await stripe.products.create({ name, description, metadata: { project: 'quotesprint', tier: key } });
  const price = await stripe.prices.create({ product: product.id, currency: 'usd', unit_amount: amount, metadata: { project: 'quotesprint', tier: key } });
  priceIds[key] = price.id;
}

data.projects ||= {};
data.projects.quotesprint ||= {};
data.projects.quotesprint.stripe ||= {};
data.projects.quotesprint.stripe.priceIds = priceIds;
fs.writeFileSync(secretsPath, JSON.stringify(data, null, 2) + '\n');

const values = {
  STRIPE_SECRET_KEY: stripeSecret,
  NEXT_PUBLIC_SITE_URL: siteUrl,
  STRIPE_PRICE_ID_STARTER: priceIds.starter,
  STRIPE_PRICE_ID_PRO: priceIds.pro,
  STRIPE_PRICE_ID_AGENCY: priceIds.agency,
};

function run(cmd, args, input) {
  const proc = spawnSync(cmd, args, { cwd: root, input, encoding: 'utf8' });
  if (proc.status !== 0) {
    throw new Error((proc.stdout || '') + (proc.stderr || ''));
  }
  return (proc.stdout || '') + (proc.stderr || '');
}

for (const [name, value] of Object.entries(values)) {
  for (const target of ['production', 'preview', 'development']) {
    const args = ['env', 'add', name, target, '--token', vercelToken];
    try {
      run('/data/.npm-global/bin/vercel', args, value + '\n');
    } catch (error) {
      const msg = String(error.message || error);
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already been added')) {
        spawnSync('/data/.npm-global/bin/vercel', ['env', 'rm', name, target, '--yes', '--token', vercelToken], { cwd: root, encoding: 'utf8' });
        run('/data/.npm-global/bin/vercel', args, value + '\n');
      } else {
        throw error;
      }
    }
  }
}

console.log('PRICE_IDS', JSON.stringify(priceIds, null, 2));
console.log('VERCEL_ENVS_SET production preview development');
