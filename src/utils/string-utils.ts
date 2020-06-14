

export function cleanText (text: string): string {
    return text
        .split(/(?:https?|ftp):\/\/[\n\S]+/g).join('') // url
        .split(/#.+\s/g).join('') // hashtags
        .split(' =&gt; ').join('')
        .split(/\s+/g).join(' ')
        .trim();
}
