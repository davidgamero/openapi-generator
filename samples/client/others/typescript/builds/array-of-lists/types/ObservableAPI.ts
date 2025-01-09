import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import type { Middleware } from "../middleware";
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
import { List } from '../models/List';
import { ListPaged } from '../models/ListPaged';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     */
    public listWithHttpInfo(_options?: Configuration | Middleware[]): Observable<HttpInfo<ListPaged>> {
    	let configuration = undefined
	let calltimeMiddleware: Middleware[] = []
	if (Array.isArray(_options)){
	    // call-time middleware provided
	    calltimeMiddleware = _options
	}else{
	    configuration = _options
	}
        const requestContextPromise = this.requestFactory.list(_options);

        // build promise chain
	let allMiddleware = this.configuration.middleware.concat(calltimeMiddleware)
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of allMiddleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public list(_options?: Configuration | Middleware[]): Observable<ListPaged> {
        return this.listWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListPaged>) => apiResponse.data));
    }

}
