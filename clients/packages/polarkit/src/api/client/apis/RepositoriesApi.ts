/* tslint:disable */
/* eslint-disable */
/**
 * Polar API
 *  Welcome to the **Polar API** for [polar.sh](https://polar.sh).  The Public API is currently a [work in progress](https://github.com/polarsource/polar/issues/834) and is in active development. 🚀  #### Authentication  Use a [Personal Access Token](https://polar.sh/settings) and send it in the `Authorization` header on the format `Bearer [YOUR_TOKEN]`.  #### Feedback  If you have any feedback or comments, reach out in the [Polar API-issue](https://github.com/polarsource/polar/issues/834), or reach out on the Polar Discord server.  We\'d love to see what you\'ve built with the API and to get your thoughts on how we can make the API better!  #### Connecting  The Polar API is online at `https://api.polar.sh`. 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  HTTPValidationError,
  ListResourceRepository,
  Platforms,
  Repository,
} from '../models/index';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    ListResourceRepositoryFromJSON,
    ListResourceRepositoryToJSON,
    PlatformsFromJSON,
    PlatformsToJSON,
    RepositoryFromJSON,
    RepositoryToJSON,
} from '../models/index';

export interface RepositoriesApiGetRequest {
    id: string;
}

export interface RepositoriesApiLookupRequest {
    platform: Platforms;
    organizationName: string;
    repositoryName: string;
}

export interface RepositoriesApiSearchRequest {
    platform: Platforms;
    organizationName: string;
    repositoryName?: string;
}

/**
 * 
 */
export class RepositoriesApi extends runtime.BaseAPI {

    /**
     * Get a repository
     * Get a repository (Public API)
     */
    async getRaw(requestParameters: RepositoriesApiGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Repository>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling get.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/repositories/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RepositoryFromJSON(jsonValue));
    }

    /**
     * Get a repository
     * Get a repository (Public API)
     */
    async get(requestParameters: RepositoriesApiGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Repository> {
        const response = await this.getRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List repositories in organizations that the authenticated user is a member of. Requires authentication.
     * List repositories (Public API)
     */
    async listRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceRepository>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/repositories`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListResourceRepositoryFromJSON(jsonValue));
    }

    /**
     * List repositories in organizations that the authenticated user is a member of. Requires authentication.
     * List repositories (Public API)
     */
    async list(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceRepository> {
        const response = await this.listRaw(initOverrides);
        return await response.value();
    }

    /**
     * Lookup repositories. Like search but returns at only one repository.
     * Lookup repositories (Public API)
     */
    async lookupRaw(requestParameters: RepositoriesApiLookupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Repository>> {
        if (requestParameters.platform === null || requestParameters.platform === undefined) {
            throw new runtime.RequiredError('platform','Required parameter requestParameters.platform was null or undefined when calling lookup.');
        }

        if (requestParameters.organizationName === null || requestParameters.organizationName === undefined) {
            throw new runtime.RequiredError('organizationName','Required parameter requestParameters.organizationName was null or undefined when calling lookup.');
        }

        if (requestParameters.repositoryName === null || requestParameters.repositoryName === undefined) {
            throw new runtime.RequiredError('repositoryName','Required parameter requestParameters.repositoryName was null or undefined when calling lookup.');
        }

        const queryParameters: any = {};

        if (requestParameters.platform !== undefined) {
            queryParameters['platform'] = requestParameters.platform;
        }

        if (requestParameters.organizationName !== undefined) {
            queryParameters['organization_name'] = requestParameters.organizationName;
        }

        if (requestParameters.repositoryName !== undefined) {
            queryParameters['repository_name'] = requestParameters.repositoryName;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/repositories/lookup`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RepositoryFromJSON(jsonValue));
    }

    /**
     * Lookup repositories. Like search but returns at only one repository.
     * Lookup repositories (Public API)
     */
    async lookup(requestParameters: RepositoriesApiLookupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Repository> {
        const response = await this.lookupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Search repositories.
     * Search repositories (Public API)
     */
    async searchRaw(requestParameters: RepositoriesApiSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListResourceRepository>> {
        if (requestParameters.platform === null || requestParameters.platform === undefined) {
            throw new runtime.RequiredError('platform','Required parameter requestParameters.platform was null or undefined when calling search.');
        }

        if (requestParameters.organizationName === null || requestParameters.organizationName === undefined) {
            throw new runtime.RequiredError('organizationName','Required parameter requestParameters.organizationName was null or undefined when calling search.');
        }

        const queryParameters: any = {};

        if (requestParameters.platform !== undefined) {
            queryParameters['platform'] = requestParameters.platform;
        }

        if (requestParameters.organizationName !== undefined) {
            queryParameters['organization_name'] = requestParameters.organizationName;
        }

        if (requestParameters.repositoryName !== undefined) {
            queryParameters['repository_name'] = requestParameters.repositoryName;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/repositories/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListResourceRepositoryFromJSON(jsonValue));
    }

    /**
     * Search repositories.
     * Search repositories (Public API)
     */
    async search(requestParameters: RepositoriesApiSearchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListResourceRepository> {
        const response = await this.searchRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
