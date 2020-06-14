import { AWSError, Comprehend } from 'aws-sdk';


export class AWSController {

    private _comprehend: Comprehend;

    public constructor() {
        this._comprehend = new Comprehend();
    }

    public detectSentimentPortuguese(sentences: string[]): Promise<Comprehend.Types.BatchDetectSentimentResponse> {
        if (sentences.length === 0 || sentences.length > 25) {
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

export default new AWSController();
