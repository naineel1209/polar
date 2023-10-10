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

import { exists, mapValues } from '../runtime';
import type { CurrencyAmount } from './CurrencyAmount';
import {
    CurrencyAmountFromJSON,
    CurrencyAmountFromJSONTyped,
    CurrencyAmountToJSON,
} from './CurrencyAmount';
import type { Organization } from './Organization';
import {
    OrganizationFromJSON,
    OrganizationFromJSONTyped,
    OrganizationToJSON,
} from './Organization';
import type { Pledge } from './Pledge';
import {
    PledgeFromJSON,
    PledgeFromJSONTyped,
    PledgeToJSON,
} from './Pledge';
import type { RewardState } from './RewardState';
import {
    RewardStateFromJSON,
    RewardStateFromJSONTyped,
    RewardStateToJSON,
} from './RewardState';
import type { User } from './User';
import {
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './User';

/**
 * 
 * @export
 * @interface BackofficeReward
 */
export interface BackofficeReward {
    /**
     * 
     * @type {Pledge}
     * @memberof BackofficeReward
     */
    pledge: Pledge;
    /**
     * 
     * @type {User}
     * @memberof BackofficeReward
     */
    user?: User;
    /**
     * 
     * @type {Organization}
     * @memberof BackofficeReward
     */
    organization?: Organization;
    /**
     * 
     * @type {CurrencyAmount}
     * @memberof BackofficeReward
     */
    amount: CurrencyAmount;
    /**
     * 
     * @type {RewardState}
     * @memberof BackofficeReward
     */
    state: RewardState;
    /**
     * If and when the reward was paid out.
     * @type {Date}
     * @memberof BackofficeReward
     */
    paid_at?: Date;
    /**
     * 
     * @type {string}
     * @memberof BackofficeReward
     */
    transfer_id?: string;
    /**
     * 
     * @type {string}
     * @memberof BackofficeReward
     */
    issue_reward_id: string;
    /**
     * 
     * @type {string}
     * @memberof BackofficeReward
     */
    pledge_payment_id?: string;
    /**
     * 
     * @type {string}
     * @memberof BackofficeReward
     */
    pledger_email?: string;
}

/**
 * Check if a given object implements the BackofficeReward interface.
 */
export function instanceOfBackofficeReward(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "pledge" in value;
    isInstance = isInstance && "amount" in value;
    isInstance = isInstance && "state" in value;
    isInstance = isInstance && "issue_reward_id" in value;

    return isInstance;
}

export function BackofficeRewardFromJSON(json: any): BackofficeReward {
    return BackofficeRewardFromJSONTyped(json, false);
}

export function BackofficeRewardFromJSONTyped(json: any, ignoreDiscriminator: boolean): BackofficeReward {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'pledge': PledgeFromJSON(json['pledge']),
        'user': !exists(json, 'user') ? undefined : UserFromJSON(json['user']),
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'amount': CurrencyAmountFromJSON(json['amount']),
        'state': RewardStateFromJSON(json['state']),
        'paid_at': !exists(json, 'paid_at') ? undefined : (new Date(json['paid_at'])),
        'transfer_id': !exists(json, 'transfer_id') ? undefined : json['transfer_id'],
        'issue_reward_id': json['issue_reward_id'],
        'pledge_payment_id': !exists(json, 'pledge_payment_id') ? undefined : json['pledge_payment_id'],
        'pledger_email': !exists(json, 'pledger_email') ? undefined : json['pledger_email'],
    };
}

export function BackofficeRewardToJSON(value?: BackofficeReward | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'pledge': PledgeToJSON(value.pledge),
        'user': UserToJSON(value.user),
        'organization': OrganizationToJSON(value.organization),
        'amount': CurrencyAmountToJSON(value.amount),
        'state': RewardStateToJSON(value.state),
        'paid_at': value.paid_at === undefined ? undefined : (value.paid_at.toISOString()),
        'transfer_id': value.transfer_id,
        'issue_reward_id': value.issue_reward_id,
        'pledge_payment_id': value.pledge_payment_id,
        'pledger_email': value.pledger_email,
    };
}

