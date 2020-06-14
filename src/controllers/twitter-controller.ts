import Twit from 'twit';


export class TwitterController {

    private twit: Twit;

    public constructor(apiKey: string, apiSecretKey: string, accessToken: string, accessTokenSecret: string) {
        this.twit = new Twit({
            consumer_key: apiKey,
            consumer_secret: apiSecretKey,
            access_token: accessToken,
            access_token_secret: accessTokenSecret,
        });
    }

    public searchTweets(params?: Twit.Params): Promise<Twit.PromiseResponse> {
        console.log(JSON.stringify(params));
        return this.twit.get('search/tweets', params);
    }

}

export default new TwitterController(
        process.env.TWITTER_API_KEY || '',
        process.env.TWITTER_API_SECRET_KEY || '',
        process.env.TWITTER_ACCESS_TOKEN || '',
        process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
);
