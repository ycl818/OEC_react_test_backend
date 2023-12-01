const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(
    "🚀 ~ file: refreshTokenController.js:6 ~ handleRefreshToken ~ cookies:",
    cookies
  );
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  console.log(
    "🚀 ~ file: refreshTokenController.js:19 ~ handleRefreshToken ~ foundUser:",
    foundUser
  );

  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      {
        username: decoded.username,
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const username = foundUser.username;
    const password = foundUser.password;

    res.json({ accessToken, username });
  });
};

module.exports = { handleRefreshToken };
