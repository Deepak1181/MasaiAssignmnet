
const axios = require('axios');

exports.githubAuth = (req, res) => {
  const clientID = process.env.CLIENT_ID;
  const redirectURI = encodeURIComponent(process.env.CALLBACK_URL);
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`);
};

exports.githubCallback = async (req, res) => {
  const code = req.query.code;
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectURI = process.env.CALLBACK_URL;

  try {
    const tokenResponse = await axios.post(`https://github.com/login/oauth/access_token`, {
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectURI
    }, {
      headers: { accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: { Authorization: `token ${accessToken}` }
    });

    console.log(userResponse.data);
    res.send('Login Successful');
  } catch (error) {
    console.error(error);
    res.send('Error during authentication');
  }
};