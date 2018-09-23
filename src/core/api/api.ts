const prod = false;

export class API {
  private apiRoot = prod ? 'https://project-sal.dotstarmoney.com/' : 'http://localhost:3030/';
  // private cloudFrontRoot = prod ? 'https://dfbowiensnhmy.cloudfront.net' : 'http://localhost:3030';
  private cloudFrontRoot = 'https://dfbowiensnhmy.cloudfront.net';
  public ping(jwt: string): Promise<Response> {
    return fetch(`${this.apiRoot}/api/v0/ping`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${jwt}`,
      },
    });
  }

  public play(jwt: string): Promise<Response> {
    return fetch(`${this.apiRoot}/api/v0/scores`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${jwt}`,
      }
    });
  }

  public getAllScores(jwt: string): Promise<Response> {
    return fetch(`${this.apiRoot}/api/v0/scores`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${jwt}`,
      }
    });
  }

  public saveSlotMachineTitle(jwt: string, title: string): Promise<Response> {
    return fetch(`${this.apiRoot}/api/v0/scores`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${jwt}`,
      }
    });
  }

  public fetchSlotMachineTitle(userId: string): Promise<Response> {
    return fetch(`${this.cloudFrontRoot}/${userId}/title.txt`, {
      method: 'GET',
      headers: {
        'content-type': 'text/plain',
      }
    });
  }
}
