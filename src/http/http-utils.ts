import axios from 'axios';


export class HttpUtils {
    private constructor() {}

    public static serialize(object: any): string {
        if (!object) {
            return '';
        }
        const serializeRecusive = (obj: any, prefix: any): string => {
            const str = [];
            for (const p in obj) {
                if (obj.hasOwnProperty(p)) {
                    const k = prefix ? prefix + "[" + p + "]" : p;
                    const v = obj[p];
                    str.push((v !== null && typeof v === "object") ? serializeRecusive(v, k) : encodeURIComponent(p) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }
        return serializeRecusive(object, undefined);
    }

    public static async get(props: { url: string, queryParams: any }): Promise<any> {
        let url = `${props.url}`;
        if (props.queryParams) {
            url += `?${this.serialize(props.queryParams)}`;
        }
        console.log(url);
        return (await axios.get(url)).data
    }

}
