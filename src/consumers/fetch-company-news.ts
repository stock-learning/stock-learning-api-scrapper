import { BatchDetectSentimentItemResult } from 'aws-sdk/clients/comprehend';
import moment from 'moment';
import { IConsumer } from 'stock-learning-rabbitmq/lib/server/iconsumer';
import { RabbitMQServer } from 'stock-learning-rabbitmq/lib/server/rabbitmq-server';
import { INewsApiArticle } from 'ts-newsapi/lib/types';
import awsController from '../controllers/aws-controller';
import newsApiController from '../controllers/news-api-controller';


export class FetchCompanyNews implements IConsumer<any> {

    consumerName = 'fetch-company-news';

    public async consume(message: any): Promise<any> {
        if (message.companies?.length) {
            const result = message.companies
                .filter((companyRequestData: any) => !!companyRequestData.query && !!companyRequestData.initials);
            const allArticles = (await Promise.all(result.map(async (companyRequestData: any) => {
                const response = await newsApiController.getEverything({
                    q: companyRequestData.query,
                    from: companyRequestData.startDate || moment().subtract(2, 'weeks').format('yyyy-MM-DD'),
                    to: companyRequestData.endDate || moment().format('yyyy-MM-DD'),
                    language: 'pt',
                });
                return response.articles?.map((article: INewsApiArticle) => {
                    return { initials: companyRequestData.initials, ...article };
                });
            }))).reduce((acc: any[], curr: any) => acc.concat(curr), []);
            const sentiments = (await awsController.detectSentimentPortuguese(allArticles.map((item: any) => item.title))).ResultList;
            sentiments.forEach((sentiment: BatchDetectSentimentItemResult) => {
                // @ts-ignore
                allArticles[sentiment.Index].sentiment = sentiment.Sentiment;
            });

            if (allArticles?.length) {
                RabbitMQServer.getInstance().getApiStub().companyNews({ companyNews: allArticles });
            }
        }
    }

}

export default new FetchCompanyNews();
