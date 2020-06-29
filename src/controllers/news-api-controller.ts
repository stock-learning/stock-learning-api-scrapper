import NewsAPI from 'ts-newsapi';
import { INewsApiEverythingParams, INewsApiResponse, INewsApiSourceParams, INewsApiSourcesResponse, INewsApiTopHeadlinesParams } from 'ts-newsapi/lib/types';


export class NewsApiController {

    private _newsApi: NewsAPI;

    public constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error(`Invalid API key "${apiKey}"`)
        }
        this._newsApi = new NewsAPI(apiKey);
    }

    public getTopHeadlines(params?: INewsApiTopHeadlinesParams): Promise<INewsApiResponse> {
        return this._newsApi.getTopHeadlines(params);
    }

    public getEverything(params?: INewsApiEverythingParams): Promise<INewsApiResponse> {
        console.log(JSON.stringify(params));
        return this._newsApi.getEverything(params);
    }

    public getSources(params?: INewsApiSourceParams): Promise<INewsApiSourcesResponse> {
        return this._newsApi.getSources(params);
    }

}

export default new NewsApiController(process.env.GOOGLE_NEWS_API_KEY || '');

