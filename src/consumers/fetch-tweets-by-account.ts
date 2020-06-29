import { BatchDetectSentimentItemResult } from 'aws-sdk/clients/comprehend';
import { IConsumer } from 'stock-learning-rabbitmq/lib/server/iconsumer';
import { RabbitMQServer } from 'stock-learning-rabbitmq/lib/server/rabbitmq-server';
import awsController from '../controllers/aws-controller';
import twitterController from '../controllers/twitter-controller';
import { TwitterQueryBuilder } from './../builder/twitter-query-builder';
import { cleanText } from "./../utils/string-utils";


export class FetchTweetsByAccount implements IConsumer<any> {

    consumerName = 'fetch-tweets-by-account';

    public async consume(message: any): Promise<any> {
        if (message?.accounts?.length) {
            const q = new TwitterQueryBuilder()
                .fromAccounts(message.accounts)
                .sinceToday()
                .build();
            const result = await twitterController.searchTweets({ q, count: 25 });
            // @ts-ignore
            const tweets = result.data.statuses.map((status: any) => {
                return {
                    account: status.user.screen_name,
                    tweet: status.text,
                    cleanText: cleanText(status.text),
                    createdAt: status.created_at,
                    statusId: status.id_str,
                }
            });

            const sentences = tweets.map((tweet: any) => tweet.cleanText);
            const sentiments = (await awsController.detectSentimentPortuguese(sentences)).ResultList;
            sentiments.forEach((sentiment: BatchDetectSentimentItemResult) => {
                tweets[sentiment.Index].sentiment = sentiment.Sentiment;
            });

            RabbitMQServer.getInstance().getApiStub().persistTweets({ tweets });
        }
    }

}

export default new FetchTweetsByAccount();
