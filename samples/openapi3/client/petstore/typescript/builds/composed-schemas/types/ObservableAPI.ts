import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from "../middleware";
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
import { Cat } from '../models/Cat';
import { Dog } from '../models/Dog';
import { FilePostRequest } from '../models/FilePostRequest';
import { PetByAge } from '../models/PetByAge';
import { PetByType } from '../models/PetByType';
import { PetsFilteredPatchRequest } from '../models/PetsFilteredPatchRequest';
import { PetsPatchRequest } from '../models/PetsPatchRequest';

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
     * @param [filePostRequest]
     */
    public filePostWithHttpInfo(filePostRequest?: FilePostRequest, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
	let allMiddleware: Middleware[] = []
	if (_options && _options.middleware){
	    // call-time middleware provided
            let calltimeMiddleware: Middleware[] = _options.middlware

	    switch(_options.middlewareMergeStrategy){
	    	case 'append':
		allMiddleware = this.configuration.middleware.concat(calltimeMiddleware)
		    break;
	    	case 'prepend':
		    allMiddleware = calltimeMiddleware.concat(this.configuration.middleware)
		    break;
		default: // replace
		    all = calltimeMiddleware
	    }
	}

        const requestContextPromise = this.requestFactory.filePost(filePostRequest, _options);
        // build promise chain
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
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.filePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [filePostRequest]
     */
    public filePost(filePostRequest?: FilePostRequest, _options?: ConfigurationOptions): Observable<void> {
        return this.filePostWithHttpInfo(filePostRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param [petsFilteredPatchRequest]
     */
    public petsFilteredPatchWithHttpInfo(petsFilteredPatchRequest?: PetsFilteredPatchRequest, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
	let allMiddleware: Middleware[] = []
	if (_options && _options.middleware){
	    // call-time middleware provided
            let calltimeMiddleware: Middleware[] = _options.middlware

	    switch(_options.middlewareMergeStrategy){
	    	case 'append':
		allMiddleware = this.configuration.middleware.concat(calltimeMiddleware)
		    break;
	    	case 'prepend':
		    allMiddleware = calltimeMiddleware.concat(this.configuration.middleware)
		    break;
		default: // replace
		    all = calltimeMiddleware
	    }
	}

        const requestContextPromise = this.requestFactory.petsFilteredPatch(petsFilteredPatchRequest, _options);
        // build promise chain
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
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.petsFilteredPatchWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [petsFilteredPatchRequest]
     */
    public petsFilteredPatch(petsFilteredPatchRequest?: PetsFilteredPatchRequest, _options?: ConfigurationOptions): Observable<void> {
        return this.petsFilteredPatchWithHttpInfo(petsFilteredPatchRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param [petsPatchRequest]
     */
    public petsPatchWithHttpInfo(petsPatchRequest?: PetsPatchRequest, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
	let allMiddleware: Middleware[] = []
	if (_options && _options.middleware){
	    // call-time middleware provided
            let calltimeMiddleware: Middleware[] = _options.middlware

	    switch(_options.middlewareMergeStrategy){
	    	case 'append':
		allMiddleware = this.configuration.middleware.concat(calltimeMiddleware)
		    break;
	    	case 'prepend':
		    allMiddleware = calltimeMiddleware.concat(this.configuration.middleware)
		    break;
		default: // replace
		    all = calltimeMiddleware
	    }
	}

        const requestContextPromise = this.requestFactory.petsPatch(petsPatchRequest, _options);
        // build promise chain
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
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.petsPatchWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param [petsPatchRequest]
     */
    public petsPatch(petsPatchRequest?: PetsPatchRequest, _options?: ConfigurationOptions): Observable<void> {
        return this.petsPatchWithHttpInfo(petsPatchRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}
