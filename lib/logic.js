/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * A member signs a contract
 * @param {org.linkd.ledger.signContract} sign - the signature to be processed
 * @transaction
 */
function signContract(sign) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    const theContract = sign.Contract;
    console.log('**** AUTH: ' + me.getIdentifier() 
    + ' attempting to sign contract ' 
    + theContract);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    if (theContract.state != 'WAITING_SIGNATURES') {
        console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is in state " + theContract.state + " so it cannot be signed ")
    }
    else {
        // if the contract is not already signed, allow it to be signed
        if (sign.Contract.creator.getIdentifier() == me.getIdentifier()) {
            if (theContract.creatorSigned) {
                console.log("**** ERROR: Contract " + theContract.getIdentifier() +
                " has already been signed by " + me.getIdentifier() +
                ", it cannot be signed again.")
            }
            else {
            theContract.creatorSigned = true;
            }
        }
        else if (sign.Contract.signator.getIdentifier() == me.getIdentifier())
        {
            if (theContract.signatorSigned) {
                console.log("**** ERROR: Contract " + theContract.getIdentifier() +
                " has already been signed by " + me.getIdentifier() +
                ", it cannot be signed again.")
            }
            else {
            theContract.signatorSigned = true;
            }
        }
    }
     /** 
     * Update everything
     */
    return getAssetRegistry('org.linkd.ledger.contract')
          .then(function (contractRegistry) {
              return contractRegistry.update(theContract);
          });
}

/**
 * A member prepares a contract for signature
 * @param {org.linkd.ledger.signContract} prepare - the signature to be processed
 * @transaction
 */
function prepareForSignature(prepare) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    const theContract = prepare.Contract;

    console.log('**** AUTH: ' + me.getIdentifier() 
    + ' preparing contract for signatures: ' 
    + theContract);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    if (theContract.state != 'CREATED') {
        console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is in state " + theContract.state + " so it cannot be prepared for signatures ");
    }
    else {
        if (sign.Contract.creator.getIdentifier() == me.getIdentifier()) {
            theContract.state = 'WAITING_SIGNATURES';
        }
        else
        {
            console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is not owned by " + me.getIdentifier() + " so it cannot be prepared for signatures ");
        }
    }
     /** 
     * Update everything
     */
    return getAssetRegistry('org.linkd.ledger.contract')
          .then(function (contractRegistry) {
              return contractRegistry.update(theContract);
          });
}

// TODO: Figure out permissions to lock it down,
// currently there is nothing restricting you from updating anything on your own contract
// without following the rules (ie, changing state just by sending your own transaction.)