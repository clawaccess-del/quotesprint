import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import Stripe from 'stripe';

const secretsPath = '/data/.openclaw/credentials/user-secrets.json';
const root = '/data/.openclaw/workspace/projects/quotesprint';
const data = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
const stripeSecret = data.tokens.stripe.secretKey;
const vercelToken = data.tokens.vercel.token;
const stripe = new Stripe(stripeSecret);

const product = await stripe.products.create({
  name: 'QuoteSprint Live + AI',
  description: 'Monthly QuoteSprint Live access plus 100 AI credits for brand-voice rewrites, custom objection handling, and expanded follow-up sequences.',
  metadata: { project: 'quotesprint', tier: 'live_ai' },
});
const price = await stripe.prices.create({
  product: product.id,
  currency: 'usd',
  unit_amount: 4900,
  recurring: { interval: 'month' },
  metadata: { project: 'quotesprint', tier: 'live_ai' },
});

data.projects ||= {};
data.projects.quotesprint ||= {};
data.projects.quotesprint.stripe ||= {};
data.projects.quotesprint.stripe.subscriptionPriceIds ||= {};
data.projects.quotesprint.stripe.subscriptionPriceIds.live_ai = price.id;
fs.writeFileSync(secretsPath, JSON.stringify(data, null, 2) + '\n');

function run(cmd, args, input) {
  const proc = spawnSync(cmd, args, { cwd: root, input, encoding: 'utf8' });
  if (proc.status !== 0) throw new Error((proc.stdout || '') + (proc.stderr || ''));
}

for (const target of ['production', 'preview', 'development']) {
  const args = ['env', 'add', 'STRIPE_PRICE_ID_LIVE_AI_MONTHLY', target, '--token', vercelToken];
  try {
    run('/data/.npm-global/bin/vercel', args, price.id + '\n');
  } catch (error) {
    const msg = String(error.message || error).toLowerCase();
    if (msg.includes('already exists') || msg.includes('already been added')) {
      spawnSync('/data/.npm-global/bin/vercel', ['env', 'rm', 'STRIPE_PRICE_ID_LIVE_AI_MONTHLY', target, '--yes', '--token', vercelToken], { cwd: root, encoding: 'utf8' });
      run('/data/.npm-global/bin/vercel', args, price.id + '\n');
    } else {
      throw error;
    }
  }
}

console.log('LIVE_AI_MONTHLY_PRICE_ID', price.id);
console.log('VERCEL_ENV_SET STRIPE_PRICE_ID_LIVE_AI_MONTHLY');
