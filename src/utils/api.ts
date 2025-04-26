import queryString from 'query-string';

interface IRequest {
    url: string;
    method: string;
    body?: any;
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
    next?: {
        tags: string[];
    };
}

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        headers: new Headers(headers),
        ...nextOption
    };

    if (useCredentials) options.credentials = "include";

    // Handle body based on content type
    if (body) {
        if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            // If body is already a string, use it directly
            if (typeof body === 'string') {
                options.body = body;
            }
            // For URLSearchParams, use toString()
            else if (body instanceof URLSearchParams) {
                options.body = body.toString();
            }
            // For object, convert to URLSearchParams then to string
            else if (typeof body === 'object') {
                const params = new URLSearchParams();
                Object.keys(body).forEach(key => {
                    params.append(key, body[key]);
                });
                options.body = params.toString();
            }
        } else {
            // Default to JSON
            options.headers.set('Content-Type', 'application/json');
            options.body = JSON.stringify(body);
        }
    }

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest) => { //type
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T; //generic
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};
