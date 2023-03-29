import URI from 'urijs';
import URITemplate from 'urijs/src/URITemplate.js';

export const APIProtocol =
  process.env.REACT_APP_API_PROTOCOL ||
  (process.env.NODE_ENV === 'production' ? 'https' : 'http');

export const APIHost =
  process.env.REACT_APP_API_HOST || 'thekey.academy';

export const APIPort = process.env.REACT_APP_API_PORT
  ? Number(process.env.REACT_APP_API_PORT)
  : undefined;

export const APIUrl = `${APIProtocol}://${APIHost}${APIPort ? `:${APIPort}` : ''}`;

export const BasePath = '/';

type QueryParams = Record<string, string | number>;

export const requestGET = <T>(
  path: string,
  options?: Record<string, string>,
  query?: QueryParams,
) => {
  return request<T>('GET', path, options, query);
};

export const requestPOST = <T>(
  path: string,
  options?: Record<string, string>,
  body?: string,
  query?: QueryParams,
) => {
  return request<T>('POST', path, options, query, body);
};

export const requestPUT = <T>(
  path: string,
  options?: Record<string, string>,
  body?: string,
  query?: QueryParams,
) => {
  return request<T>('PUT', path, options, query, body);
};

export const requestDELETE = <T>(
  path: string,
  options?: Record<string, string>,
  query?: QueryParams,
) => {
  return request<T>('DELETE', path, options, query);
};

const request = <T>(
  method: string,
  path: string,
  options?: Record<string, string>,
  query?: QueryParams,
  body?: string,
) => {
  const uriPath = URI(APIUrl).pathname(
    URI.joinPaths(BasePath, URITemplate(path).expand(options || {})).valueOf(),
  );
  query &&
    Object.keys(query).forEach(key => {
      uriPath.addQuery(key, query[key]);
    });
  const normalisedUrl = uriPath.valueOf();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  return fetch(normalisedUrl, {
    method,
    headers,
    body,
  })
    .then(async response => {
      const text = await response.text().catch(() => '');
      if (response.status !== 200) {
        try {
          const json = JSON.parse(text);
          return Promise.reject(json);
        } catch (e) {
          return Promise.reject({ message: 'Request failed.' });
        }
      }
      return text;
    })
    .then(text => {
      try {
        const json = JSON.parse(text);
        return json;
      } catch (e) {
        return undefined;
      }
    }) as Promise<T | undefined>;
};
