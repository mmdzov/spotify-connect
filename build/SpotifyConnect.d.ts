import { NewTokenCallback } from "./global";
import { ConfigPath, Scope } from "./global";
declare class SpotifyConnect {
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
    Config(client_id: string, client_secret: string, config: ConfigPath, scope?: Scope[]): string;
    spotifyAuthorize(): Promise<any>;
    /**
     * @param {string} refresh_token  If you have a valid refresh_token, you can enter it here to create a new access_token for accessing spotify api every hour
     * @param {object} callback Receive new token values ​​every hour
     * @example
     * newtoken("refresh_token_code",({access_token,refresh_token}) => {
     *    console.log(access_token) //generated new access_token you can use this
     * })
     */
    newtoken(refresh_token: string, callback: NewTokenCallback): void;
}
export default SpotifyConnect;
