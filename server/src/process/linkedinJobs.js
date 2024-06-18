const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');
const readline = require('readline');

let open;

// Function to dynamically import the `open` module
const importOpenModule = async () => {
    const openModule = await import('open');
    open = openModule.default;
};

// Function to get LinkedIn Access Token
const getLinkedInAccessToken = async (code) => {
  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const linkedinRedirectUri = process.env.LINKEDIN_REDIRECT_URI;

  const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  const params = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: linkedinRedirectUri,
    client_id: linkedinClientId,
    client_secret: linkedinClientSecret
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching LinkedIn access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to get LinkedIn User Profile
const getLinkedInUserProfile = async (accessToken) => {
  const profileUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)';

  try {
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const profile = profileResponse.data;
    return profile;
  } catch (error) {
    console.error('Error fetching LinkedIn user profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Main function to execute the OAuth flow and get user profile
const main = async () => {
  await importOpenModule();  // Ensure `open` module is imported before proceeding

  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const linkedinRedirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const state = crypto.randomBytes(16).toString('hex'); // Generate a unique state string
  const scope = 'r_basicprofile';

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(linkedinRedirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

  console.log('Open this URL in your browser to start the LinkedIn OAuth flow:');
  console.log(authorizationUrl);

  // Open the LinkedIn authorization URL in the default web browser
  await open(authorizationUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the authorization code from the callback URL: ', async (code) => {
    try {
      const accessToken = await getLinkedInAccessToken(code);
      const profile = await getLinkedInUserProfile(accessToken);
      console.log('LinkedIn User Profile:', JSON.stringify(profile, null, 2));
    } catch (error) {
      console.error('Error during the LinkedIn OAuth flow:', error);
    } finally {
      rl.close();
    }
  });
};

if (require.main === module) {
  main();
}

module.exports = { getLinkedInAccessToken, getLinkedInUserProfile };