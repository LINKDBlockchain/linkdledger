# LINKDLedger: A Hyperledger Composer based document signing system

## Preparation

### Install Dev Dependencies

Ensure you have docker installed: www.docker.com

Install the node dependencies

`npm install -g composer-cli composer-rest-server generator-hyperledger-composer yo composer-playground`

### Install Fabric Dev Network

1. Download the dependencies:
```bash
mkdir fabric-dev-servers && cd fabric-dev-servers
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip fabric-dev-servers.zip
```

2. Build fabric network & start it up
```
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```

# Running Network 

## Deploy Network to HLF Instance

1. Install the network
`composer network install -a [linkdledger bno file] -c PeerAdmin@hlfv1`

2. Start the network
`composer network start -c PeerAdmin@hlfv1 -A admin -S adminpw -V 0.0.1 -f admincard`

3. Load admin card to composer card store
`composer card import --file admincard.card`

4. Ping-test to see if network is up and running
`composer network ping --card admin@linkdledger`

This command should show Command Succeeded


## Run composer REST API

Navigate the directory that your project is in, and execute the command 
`composer-rest-server`

Answer the questions to get it running. For example - no namespaces, no auth, Yes for event publication, No TLS

## Generate Angular project
`yo hyperledger-composer`
Select Angular project
Answer the questions