import SpotifyConnect from "./SpotifyConnect";
let spotify = new SpotifyConnect();

let redirect_uri = spotify.Config(
  "cb9db34d087c4f6dbcbc31fb5a7d1baf",
  "28671d0d5dcb4dd6bf63ba804a81677b",
  {
    port: 4000,
  },
  ["playlist-read-private"]
);

console.log(redirect_uri); // Copy the result and paste in redirect_uri on your spotify project setting

spotify.spotifyAuthorize((auth_data) => {
  console.log(auth_data);
}); // In this step you will definitely need refresh_token for the next step. Because access_token changes every hour and you can generate a new access_token with refresh_token

spotify.newtoken(
  "AQBn1-ejpSTFJycreEtGmn2fRWxPPMcour4ORG9QMnf8Rtaqxiw4NWHBtkieGn1EHpOSsZT19hW3ywr1ccCFboJO0aEFLrYfaZ0G8DOtwbMXkpYD0MDgLyKUXk1Hf4QBa6s",
  () => {}
); // You can delete the previous step code before executing this code. Be careful not to delete the configuration. This result gives you a new access_token every hour
