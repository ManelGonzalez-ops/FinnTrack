const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-5378874.okta.com',
  token: '00g362Rw39M0yG9NiGdPcraP73hIM6F-XqxCq7NALn'
});

module.exports = client;