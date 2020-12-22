// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const key = process.env.HAUKI_KEY;
const username = process.env.HAUKI_USER || 'admin@hel.fi';
const resource = process.env.HAUKI_RESOURCE || 'tprek:8215';
const organization =
  process.env.HAUKI_ORGANIZATION ||
  'tprek:dc7d39db-b35a-4612-a921-1b7b24b0baa3';
const source = process.env.HAUKI_SOURCE || 'tprek';
const now = new Date();
const createdAt = now.toJSON();
const validUntil =
  process.env.HAUKI_VALID_UNTIL ||
  new Date(now.setDate(now.getDate() + 7)).toJSON();

const signatureStr = `${source}${username}${createdAt}${validUntil}${organization}${resource}`;

const signature = crypto
  .createHmac('sha256', Buffer.from(key, 'utf-8'))
  .update(Buffer.from(signatureStr, 'utf-8'))
  .digest('hex');

const queryParameters = [
  `hsa_source=${encodeURIComponent(source)}`,
  `hsa_username=${encodeURIComponent(username)}`,
  `hsa_created_at=${encodeURIComponent(createdAt)}`,
  `hsa_valid_until=${encodeURIComponent(validUntil)}`,
  `hsa_resource=${encodeURIComponent(resource)}`,
  `hsa_organization=${encodeURIComponent(organization)}`,
  `hsa_signature=${signature}`,
].join('&');

process.stdout.write(queryParameters);
