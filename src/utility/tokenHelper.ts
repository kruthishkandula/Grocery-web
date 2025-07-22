import { CMS_TOKEN } from './config';

/**
 * Shows token information and instructions to help debug authentication issues
 */
export const showTokenInfo = () => {
  console.group('🔑 CMS API Token Information');
  
  if (CMS_TOKEN) {
    // Only show a small part of the token for security
    const tokenPreview = CMS_TOKEN.length > 10 
      ? `${CMS_TOKEN.substring(0, 5)}...${CMS_TOKEN.substring(CMS_TOKEN.length - 5)}`
      : '[token too short]';
      
    console.log(`Token is set (${CMS_TOKEN.length} characters): ${tokenPreview}`);
    console.log('Token length appears: ' + (CMS_TOKEN.length > 30 ? '✅ Valid' : '❌ Too short'));
  } else {
    console.warn('❌ No CMS token is set!');
  }
  
  console.log('\nTo fix authentication issues:');
  console.log('1. Create or update your .env file with:');
  console.log('   REACT_APP_CMS_TOKEN=your_token_here');
  console.log('2. Restart your development server');
  console.log('3. If using production build, rebuild with the correct token');
  
  console.groupEnd();
  
  return !!CMS_TOKEN && CMS_TOKEN.length > 30;
};

/**
 * Creates a new environment file with the token from tokens.txt
 * Call this from the browser console to help users fix their setup
 */
export const createEnvFileWithToken = () => {
  const token = '69a30e8369fb44cdd86a53d2a4d9f87d29753074cace2346e4c8a02548361677537d633a86dac262d0a9a0f30717eb0d2aeab48e98d67a2fea64bb168a8daef5d79c1e80c747f055a6c7836aacddb07682cfa44e06412724210105a4c05cb45a512d973e42569cd84a0545760751f40a69e90b8cc85eadb0b80a0969b39d9b61';
  
  const envContent = `REACT_APP_CMS_URL=http://localhost:3005/api
REACT_APP_CMS_TOKEN=${token}
REACT_APP_NODE_URL=http://localhost:3000/api
REACT_APP_APP_OPCO=INDIA`;

  console.group('📝 Environment File Setup');
  console.log('Here is the content for your .env file:');
  console.log(envContent);
  console.log('\nInstructions:');
  console.log('1. Create a file named .env in the root of your project');
  console.log('2. Copy and paste the content above into the file');
  console.log('3. Save the file and restart your development server');
  console.groupEnd();
  
  // Create a downloadable file to make it easier
  try {
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ .env file download initiated!');
  } catch (error) {
    console.error('Could not create downloadable file:', error);
  }
};
