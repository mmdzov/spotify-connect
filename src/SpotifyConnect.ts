import { NewTokenCallback } from "./global";
import { ConfigPath, NewTokenData, Scope } from "./global";
import urlEncode from "urlencode";
import express from "express";
import { encode } from "js-base64";
import axios from "axios";
import open from "open";
import http from "http";

export class SpotifyConnect {
  /**
   *
   * @param {string} client_id When you register your application, Spotify provides you a Client ID
   *
   * @param {string} client_secret When you register your application, Spotify provides you a Client Secret
   *
   * @param {object} config You need to enter the current port of your running server. You can enter your route. Default path: "/callback"
   * @example
   * {
   *    port: 4000,
   *    path: "/callback"
   * }
   *
   * @param {object} scope Optional.A space-separated list of scopes.If no scopes are specified, authorization will be granted only to access publicly available information: that is, only information normally visible in the Spotify desktop, web, and mobile players.
   *
   */
  Config(
    client_id: string,
    client_secret: string,
    config: ConfigPath,
    scope?: Scope[]
  ): string {
    process.env.CLIENT_ID = client_id;
    process.env.PORT = config?.port.toString()! || "8888";
    process.env.CLIENT_SECRET = client_secret;
    process.env.REDIRECT_URI = `http://localhost:${config.port}${
      config.path && config.path?.length! > 0 ? config.path : "/callback"
    }`;
    if (scope instanceof Array) {
      process.env.scopes = JSON.stringify(scope);
    }
    return process.env.REDIRECT_URI;
  }

  async spotifyAuthorize() {
    const encodedRedirectUri = urlEncode(process.env.REDIRECT_URI!);
    const encodedClient = encode(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    );
    const app = express();
    let server = http.createServer(app);
    let scopes = JSON.parse(process.env.scopes!);
    if (scopes instanceof Array) {
      scopes = scopes.join(" ");
    } else {
      scopes = "";
    }
    let ENDPOINT = `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&scopes=${scopes}&response_type=code&redirect_uri=${encodedRedirectUri}`;
    await open(ENDPOINT);
    app.get("/callback", async (req, res) => {
      let accessCode = req.url.split("=")[1];
      if (accessCode.length > 40 && !accessCode.includes("undefined")) {
        let { data } = await axios.post(
          `https://accounts.spotify.com/api/token`,
          `grant_type=authorization_code&code=${accessCode}&redirect_uri=${encodedRedirectUri}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${encodedClient}`,
            },
          }
        );
        process.env.AUTH = JSON.stringify(data);
        process.env.ACCESS_TOKEN = data.access_token;
        res.set("Content-Type", "text/html");
        res.send(
          Buffer.from(`<div>
          <h2> This is important data, please save it somewhere:</h2>
          <p><b>access_token:</b> ${data?.access_token}</p>
          <p><b>expires_in:</b> ${data?.expires_in} 1hr</p>
          <p><b>refresh_token:</b> ${data?.refresh_token}</p>
          </div>`)
        );
      }
    });
    server.listen(+process.env.PORT!);
    server.close();
    return JSON.parse(process.env.AUTH!);
  }

  /**
   * @param {string} refresh_token  If you have a valid refresh_token, you can enter it here to create a new access_token for accessing spotify api every hour
   * @param {object} callback Receive new token values ​​every hour
   * @example
   * newtoken("refresh_token_code",({access_token,refresh_token}) => {
   *    console.log(access_token) //generated new access_token you can use this
   * })
   */
  newtoken(refresh_token: string, callback: NewTokenCallback) {
    let curl = `grant_type=refresh_token&refresh_token=${refresh_token}`;
    const encodedClient = encode(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    );
    let handleRefreshToken = async () => {
      try {
        let { data } = await axios.post(
          "https://accounts.spotify.com/api/token",
          curl,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${encodedClient}`,
            },
          }
        );
        process.env.ACCESS_TOKEN = data.access_token;
        callback(data);
      } catch (e: any) {}
    };
    if (!process.env.ACCESS_TOKEN) {
      handleRefreshToken();
    } else
      setInterval(() => {
        handleRefreshToken();
      }, 3550 * 1000);
  }
}
