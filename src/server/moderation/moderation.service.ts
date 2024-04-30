// TODO: Manual report mechanisms

export class ModerationService {
  constructor() {}

  async checkAdultRatedImage(file: File): Promise<boolean> {
    const base64Data = Buffer.from(await file.arrayBuffer()).toString('base64');

    const searchParams = new URLSearchParams();

    searchParams.set('key', process.env.MODERATE_CONTENT_API_KEY!);
    searchParams.set('base64', 'true');
    searchParams.set('url', `data:${file.type};base64,${base64Data}`);

    const res = await fetch('https://api.moderatecontent.com/moderate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: searchParams.toString(),
    });

    const json = await res.json();

    if ('rating_index' in json) {
      return json.rating_index !== 1;
    } else {
      // TODO: Report this case
      return false;
    }
  }
}
