'use strict';

/**
 * A member signs a contract
 * @param {org.linkd.ledger.signContract} sign - the signature to be processed
 * @transaction
 */
async function signContract(sign) { 
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
        else if (theContract.signator.getIdentifier() == me.getIdentifier())
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
const contractRegistry = await getAssetRegistry('org.linkd.ledger.contract');
await contractRegistry.update(theContract);
  
}

/**
 * A member prepares a contract for signature
 * @param {org.linkd.ledger.prepareForSignature} prepare - the signature to be processed
 * @transaction
 */
async function prepareForSignature(prepare) {  // eslint-disable-line no-unused-vars

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
        if (theContract.creator.getIdentifier() == me.getIdentifier()) {
            theContract.state = 'WAITING_SIGNATURES';
        }
        else
        {
            console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is not owned by " + me.getIdentifier() + " so it cannot be prepared for signatures ");
        }
    }

const contractRegistry = await getAssetRegistry('org.linkd.ledger.contract');
  
await contractRegistry.update(theContract);
}

/**
 * A member prepares a contract for signature
 * @param {org.linkd.ledger.completeSignoff} complete - the signature to be processed
 * @transaction
 */
async function completeSignoff(complete) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    const theContract = complete.Contract;

    console.log('**** AUTH: ' + me.getIdentifier() 
    + ' completing signoff for contract: ' 
    + theContract);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    if (theContract.state != 'WAITING_SIGNATURES') {
        console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is in state " + theContract.state + " so signoff cannot be completed");
    }
    else {
        if (theContract.creator.getIdentifier() == me.getIdentifier()) {
            if(theContract.creatorSigned && theContract.signatorSigned) 
            {
                theContract.state = 'COMPLETE';
            }
            else {
                console.log("**** ERROR: Contract " + theContract.getIdentifier()
                + " does not have all required signatures, so signoff cannot be completed");
            }
        }
        else
        {
            console.log("**** ERROR: Contract " + theContract.getIdentifier()
            + " is not owned by " + me.getIdentifier() + " so it signoff cannot be completed ");
        }
    }

const contractRegistry = await getAssetRegistry('org.linkd.ledger.contract');
  
await contractRegistry.update(theContract);

}

/**
 * A member prepares a contract for signature
 * @param {org.linkd.ledger.createContract} create - the signature to be processed
 * @transaction
 */
async function createContract(create) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    const NS = 'org.linkd.ledger';
    const factory = getFactory();

    console.log('**** AUTH: ' + me.getIdentifier() 
    + ' creating contract with ID ' + create.docId);

    if (!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    const contract = factory.newResource(NS, 'contract', create.docId);
    contract.documentHash = create.docHash;
    contract.creator = me;
    contract.signator = create.signator;
    contract.creatorSigned = false;
    contract.signatorSigned = false;
    contract.state = "CREATED";

const contractRegistry = await getAssetRegistry('org.linkd.ledger.contract');
  
await contractRegistry.add(contract);

}