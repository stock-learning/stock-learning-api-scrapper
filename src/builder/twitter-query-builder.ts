import moment from 'moment';


export class TwitterQueryBuilder {

    private _query: string = '';
    private _accounts: string[] = [];
    private _since: Date | undefined;

    public withQuery(query: string): TwitterQueryBuilder {
        this._query = query;
        return this;
    }

    public fromAccount(account: string): TwitterQueryBuilder {
        this._accounts.push(account);
        return this;
    }

    public fromAccounts(accounts: string[]): TwitterQueryBuilder {
        accounts.forEach(account => this._accounts.push(account));
        return this;
    }

    public since(date: Date): TwitterQueryBuilder {
        this._since = date;
        return this;
    }

    public sinceToday(): TwitterQueryBuilder {
        return this.since(moment().toDate());
    }

    public build(): string {
        let result = this._query ? this._query : `${this._query} `;
        result += this._accounts.map(account => `from:${account}`).join(' OR ');
        if (this._since) {
            result += ` since:${moment(this._since).format('yyyy-MM-DD')} `
        }
        return result;
    }

}

