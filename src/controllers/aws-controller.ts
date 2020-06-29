import { AWSError, Comprehend } from 'aws-sdk';


export class AWSController {

    private _comprehend: Comprehend;

    public constructor(params: AWSControllerParams) {
        this._comprehend = new Comprehend(params);
    }

    public detectSentimentPortuguese(sentences: string[]): Promise<Comprehend.Types.BatchDetectSentimentResponse> {
        if (!sentences?.length) {
            return new Promise((resolve) => resolve({
                ResultList: [],
                ErrorList: [],
            }));
        }
        if (sentences.length > 25) {
            return new Promise((_, reject) => reject(new Error('List size is greater than 25')))
        }
        return new Promise((resolve, reject) => {
            this._comprehend.batchDetectSentiment(
                { TextList: sentences, LanguageCode: 'pt' },
                (err: AWSError, data: Comprehend.Types.BatchDetectSentimentResponse) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
            );
        });
    }

}

export default new AWSController({
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
});

export interface AWSControllerParams {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}
