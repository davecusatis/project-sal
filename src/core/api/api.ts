const prod = false;

export class API {
  private apiRoot = prod ? 'https://project-sal.dotstarmoney.com/' : 'http://localhost:3030/';

  public ping(jwt: string): Promise<Response> {
    return fetch(this.apiRoot + 'api/v0/ping', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + jwt,
      },
    });
  }

  public play(jwt: string): Promise<Response> {
    return fetch(this.apiRoot + 'api/v0/scores', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + jwt,
      }
    });
  }

  public getAllScores(jwt: string): Promise<Response> {
    console.log('gettin scores');
    return fetch(this.apiRoot + 'api/v0/scores', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer ' + jwt,
      }
    });
  }
}
