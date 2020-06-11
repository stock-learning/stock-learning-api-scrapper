import moment from 'moment';
import { IConsumer } from 'stock-learning-rabbitmq/lib/server/iconsumer';
import { RabbitMQServer } from 'stock-learning-rabbitmq/lib/server/rabbitmq-server';
import { INewsApiArticle } from 'ts-newsapi/lib/types';
import newsApiController from '../controllers/news-api-controller';


export class FetchCompanyNews implements IConsumer<any> {

    consumerName = 'fetch-company-news';

    public async consume(message: any): Promise<any> {
        if (message.companies?.length) {
            const result = message.companies
                .filter((companyRequestData: any) => !!companyRequestData.companyName && !!companyRequestData.companyInitials)
                .flatMap(async (companyRequestData: any) => {
                    const response = await newsApiController.getEverything({
                        q: companyRequestData.companyName,
                        from: companyRequestData.startDate || moment().day(6).month(5).year(2020).format('yyyy-MM-DD'),
                        to: companyRequestData.endDate || moment().format('yyyy-MM-DD'),
                        language: 'pt',
                    });
                    return response.articles?.map((article: INewsApiArticle) => {
                        return { companyInitials: companyRequestData.companyInitials, ...article };
                    });
            });
            const re = await Promise.all(result);
            console.log(JSON.stringify(re))
            // console.log(result.map((r: any) => JSON.stringify(r)));
            if (result?.length) {
                RabbitMQServer.getInstance().getApiStub().companyNews({ companyNews: result });
            }
        }
    }

}

export default new FetchCompanyNews();
