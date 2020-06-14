import { ConsumerMap } from 'stock-learning-rabbitmq/lib/server/consumer-map';
import { RabbitMQServer } from 'stock-learning-rabbitmq/lib/server/rabbitmq-server';
import fetchCompanyNews from './consumers/fetch-company-news';
import fetchTweetsByAccount from './consumers/fetch-tweets-by-account';


const consumers = ConsumerMap.builder()
    .register(fetchCompanyNews)
    .register(fetchTweetsByAccount)
    .build();

RabbitMQServer.createServer(process.env.RABBITMQ_CONNECTION_STRING || '')
    .usingConsumers(consumers)
    .listenToQueue('stock-learning-api-scrapper');
