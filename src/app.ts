// import { ConsumerMap } from 'stock-learning-rabbitmq/lib/server/consumer-map';
// import { RabbitMQServer } from 'stock-learning-rabbitmq/lib/server/rabbitmq-server';
// import fetchCompanyNews from './consumers/fetch-company-news';
import Twit from 'twit';


// const consumers = ConsumerMap.builder()
//     .register(fetchCompanyNews)
//     .build();

// RabbitMQServer.createServer(process.env.RABBITMQ_CONNECTION_STRING || '')
//     .usingConsumers(consumers)
//     .listenToQueue('stock-learning-api-scrapper');

const twit = new Twit({
    consumer_key: process.env.TWITTER_API_KEY || '',
    consumer_secret: process.env.TWITTER_API_SECRET_KEY || '',
    access_token: process.env.TWITTER_ACCESS_TOKEN || '',
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
});

twit.get('search/tweets', { q: 'banana since:2011-07-11', count: 2 }, function(err, data, response) {
    console.log(data);
})
