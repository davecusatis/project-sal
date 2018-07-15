const prod = false;

export class API {
  private apiRoot = prod ? 'https://sr.dotstarmoney.com:3030/' : 'http://localhost:3030/';

  public ping(jwt: string): Promise<Response> {
    return fetch(this.apiRoot + 'api/v0/ping', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + jwt,
      },
    });
  }

  public play(jwt: string): Promise<Response> {
    return fetch(this.apiRoot + 'api/v0/play', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + jwt,
      }
    });
  }
}
