/**
 * Application wide configuration.
 */
const config = {
  env: process.env.NODE_ENV,
  basename: process.env.REACT_APP_BASE_NAME,
  baseURI: process.env.REACT_APP_API_BASE_URI,
  folderId: process.env.REACT_APP_FOLDER_ID,
  clientId: process.env.REACT_APP_CLIENT_ID,
  googleAppId: process.env.REACT_APP_GOOGLE_APP_ID,
  developerKey: process.env.REACT_APP_DEVELOPER_KEY,
};

export default config;
