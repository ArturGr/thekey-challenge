# thekey-challenge
A fullstack challenge from thekey.academy

# Installation
First clone this repository.
```sh
git clone git@github.com:ArturGr/thekey-challenge.git
```

# Presentation
Install all the node modules before starting up.
```sh
(cd thekey-web && npm install ) && (cd thekey-api/post-processor && yarn ) && (cd thekey-api/thekey-backend && yarn )
```

Then start the webplatform, the backend and the microservice. Every command in separate terminal. 
```sh
cd thekey-web && npm run start
cd thekey-api/post-processor && yarn run start
cd thekey-api/thekey-backend && yarn run start
```

* Open link in Browser: http://localhost:3001/


# Testing
You can test every module with the following commands

## React App tests
```sh
cd thekey-web && npm run test
```

## Api and microservice tests
```sh
cd thekey-api/post-processor && yarn run test
cd thekey-api/thekey-backend && yarn run test
```

## Api e2e tests
You need to start the microservice in a separate terminal before running the e2e test 
```sh
cd thekey-api/post-processor && yarn run start
cd thekey-api/thekey-backend && yarn run test:e2e
```

## Microservice e2e tests 
```sh
cd thekey-api/post-processor && yarn run test:e2e
```