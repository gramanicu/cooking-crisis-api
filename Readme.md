# Cooking Crisis API

The backend server for the Cooking Crisis game.

## Table of Contents

- [Cooking Crisis API](#cooking-crisis-api)
  - [Table of Contents](#table-of-contents)
  - [Project structure](#project-structure)
  - [API](#api)
    - [Routes](#routes)
    - [Models](#models)
  - [Server settings](#server-settings)
    - [Configs](#configs)
    - [Constants](#constants)
  - [Conventions / Coding styles](#conventions--coding-styles)
  - [Various info](#various-info)

## Project structure

The server logic is found in the "_server/_" folder. It's organized in the following manner:

- _constants/_ - all the constants used inside the code (not "_const_" datatype, but hardcoded constants). These are used for certain settings that are not "environment dependent"
- _controllers/_ - the controllers used by the server. The requests are "routed" to them, and they are then handled accordingly.
- _middleware/_ - different middleware used: error handling, logging, CORS, etc..
- _routes/_ - the routes used by the api. They are further separated into different versions.
- _services/_ -  The services contains the functions that do most of the "intensive computations" (database searching, updates, input verifications, etc..). The code written here is "unaware" of the server (they get parameters, not requests and generate data, not responses)

Inside the configs file we can found different settings for the server, depending on the environment: "local", "development" and "production".

## API

### Routes

There is a special route, that returns this documentation, _"/docs"_. All the other api routes are of the form _"{{domain}}/api/{`version`}/..."_. Currently, the `v1` API is used. The routes will be documented in the following section.

**"Public" `/users` routes**

As defined in [#15](https://github.com/gramanicu/cooking-crisis-api/issues/15), these routes are related to the user accounts, but they don't expose private data (mostly because most of the routes are related to account creation anyway). The following routes are implemented:

- **GET `../users/exists/:username`** - check if a user exists. His username (IGN) must be specified. The name is provided inside the path (`/:username`)

  Response format:

  ```js
    {
      // Same meaning as in the other responses, but
      // in this case an "error" means the user was
      // not found (and "success" means the opposite)
      "res_status": String,
      "message": String
    }
  ```

- **GET `../users/status/:username`** - check the status of a user. His username (IGN) must be specified. The status is returned as a number. See the `user_status` constant for more information.

  Response format:

  ```js
    {
      "res_status": String,
      "message": String,

      // The status of the found user
      "status": Number?
    }
  ```

- **GET `../users/activation/:activation_token`** - activate an account, the one that has this specific `activation_token`. It expires in a specific amount of time (3 days, after that the account is deleted)

  Response format:

  ```js
    {
      "res_status": String,
      "message": String
    }
  ```

- **POST `../users/new`** - create a new "_player_" account. If successful, an activation link will be sent via email, available for 3 days. During this time, the account is **reserved**, but doesn't actually exist. The data must be sent in the request body in the following json format:

  Request body:

  ```js
    {
      // The IGN for the user. Must be unique. It will be save
      // preserving the case, but when it is used for indexing,
      // it is case-insensitive
      // The string must be between 1 and 16 characters,
      // alphanumeric and {{ _.#&- }}
      "username": String,

      // The email that will be associated to the account. A email
      // address can be linked to two accounts, if they are of
      // different types (admin and player)
      "email": String,

      // The password used to sign into the account.
      // The password must have between 8 and 32 characters,
      // including a number, upper and lowercase char and a
      // special character {{ #!$%&'*+,-./:;<=>?@^_`~ }}
      "password": String
    }
  ```

  Response format:

  ```js
    {
      "res_status": String,
      "message": String
    }
  ```

- **POST `../users/signin`** - sign in into an account (player or admin). For the login, only the IGN can be used. However, the sign in is case insensitive. The data must be sent in the request body in the following json format:

  Request body:

  ```js
    {
      "username": String,
      "password": String
    }
  ```

  Response format:

  ```js
    {
      "res_status": String,
      "message": String,

      // The access token. Used for the private routes. Valid
      // only for a short amount of time
      "jwt_access_token": String,

      // The refresh token. Used to create a new 
      // `jwt_access_token`. Valid for a long period
      // of time
      "jwt_refresh_token": String,

      // The "TTL" of the `jwt_access_token` in seconds. If
      // half of the time is elapsed, a new one can be created
      "access_expiry": Number
    }
  ```

- **GET `../users/token/:refresh_token`** - obtain a new `jwt_access_token`, only if the current one has spent more than 1/2 of it's "TTL". If the condition is not met, the current token is returned (not a new one). The refresh_token is provided inside the path (`/:refresh_token`)

  Response format:

  ```js
    {
      "res_status": String,
      "message": String,

      // The access token. Used for the private routes. Valid
      // only for a short amount of time
      "jwt_access_token": String,

      // The "TTL" of the `jwt_access_token` in seconds. If
      // half of the time is elapsed, a new one can be created
      "access_expiry": Number
    }
  ```

**"Private" `/users` routes**

These routes are related to the user accounts, and can be accessed only after obtaining the `jwt_access_token`. The token must be passed inside the _headers_, in the `Authorization` field, with the `Bearer` type ("Authorization" = "Bearer `<auth token>`").

- **GET `../users/account`** - get the account data (only the data that is relevant to the user)

  Response format:

  ```js
    {
      "res_status": String,
      "message": String,

      // All the following data is optional as it is
      // returned only if the `jwt_access_token` was valid.
      // However, all the fields are returned if the request
      // is successful (authenticated)

      // The IGN of the user
      "name": String?,
      
      // The email used by the user
      "email": String?,
      
      // The status of the user
      "status": Number?,

      // The elo of the user
      "elo": Number?,
      
      // When was the account created
      "created_at": String?
    }
  ```

- **PATCH `../users/password`** - change the password of the authenticated user.

  Request body:

  ```js
    {
      // The current password of the user
      "old_password": String,

      // The new password chosen by the user
      "new_password": String,

      // The new password, repeated.
      "repeated_password": String
    }
  ```

  Response format:

  ```js
    {
      "res_status": String,
      "message": String
    }
  ```

- **PATCH `../users/signout`** - signs out the authenticated user. It will change his status to offline and remove the `jwt_refresh_token`, among other things.

  Request body:

  ```js
    {
      // The `jwt_refresh_token`
      "refresh_token": String
    }
  ```

  Response format:

  ```js
    {
      "res_status": String,
      "message": String
    }
  ```

### Models

**`User`**

This model contains all the data related to the users accounts. Some fields (like `lowercase_name`) were created to simplify DB operations (for this case, to ensure that there are no two users with similar usernames: "UsEr" and "user", but still be able to have different cases for the letters in the username). Some data is redundant for the admin users (`elo`).

The status field is defined in the `server/constants`, inside a "enum" (sort of, as they don't actually exist in js), `user_status`. Each number represents a specific user state (ex. "1 = _offline_", "4 = _playing_"). The `activated` fields represents whether or not the email address was verified and the account is now valid.

```js
{
    // Data shared by all user types
    "name": String,
    "lowercase_name": String,
    "email": String,
    "password": String,
    "status": Number,
    "elo": Number,
    "is_admin": Boolean,
    "created_at": Date,
    "activated": Boolean,

    // This is the token used to refresh JWT auth tokens
    // (created at login)
    "refresh_token": String,

    // These are not required, as they are 
    // deleted after the account is created
    "activation_token": String,
    "activation_expiry": Date,
}
```

## Server settings

The way the server works is altered by two types of settings: `configs` and `constants`. The distinction between them is quite subtle, but basically the configs are specific to the "server environment" (local, development or production). The constants were used to avoid hardcoded information (schema names, regex, expire times, etc..).

### Configs

`configs/index.js` contains default values and loads more specific configuration, depending on the environment. Many of the values here are loaded from environment variables, so they are not included in the repository, as they are private information.

```js
{
    // The environment where the server is now "deployed"
    // Possible values are {"local", "development", "production"}
    "env": String,

    // The hostname of the server (base url). All the routes are
    // derived from it. Depending on the situation, the port must
    // be included (ex. http://localhost:3000)
    "hostname": String,

    // The port used by the express server
    "port": Number,

    // The base url for the activation link. This is the link sent to the
    // users email address. Can be set to the backend activation route or
    // to a route in the frontend. At the end of the link, the "activation id"
    // will be appended
    "activation_address": String,

    // The url used to connect to the redis db. Leave empty
    // to connect with the default settings
    "redis_url": String,

    // The url used to connect to the database (mongoDB)
    "mongoose_uri": String,

    // The "secret" used to encrypt the access JWT
    "jwt_access_secret": String,

    // The "secret" used to encrypt the refresh JWT
    "jwt_refresh_secret": String,

    // Wether or not an account must be activated before being able
    // to login. Used for testing purposes mainly.
    "verify_activated": Boolean
}
```

### Constants

Inside `server/constants`, the program constants are defined. Some of them are related to the api routes (users, matches, leaderboard), storing schema names and collections, enums (ex. user_status - the status of a user). The `utils` constants are used for more "generic" operations. The following constants are defined:

- `*_regexp`: `String` - These regular expressions are used to validate usernames, passwords and emails
- `salting_rounds`: `Number` - Number of salting rounds used when encrypting the passwords
- `starting_elo`: `Number` - The elo a player starts with
- `activation_expiry_time`: `Number` - How much time (in milliseconds) the activation link is valid (the one sent to the email address).
- `jwt_access_expiry_time` : `String` - In how much time will the access JWT expire. A few examples: "10m" (10 minutes), "7d" (7 days), "24h" (24 hours).
- `jwt_refresh_expiry_time` : `String` - In how much time will the refresh JWT expire. See the constant above for more info.
- `jwt_access_expiry_time_seconds`: In how much time (in seconds) will the access JWT expire. This should have the same value as the `jwt_access_expiry_time`, but in seconds.
- `cache_default_ttl` : `Number` - How much time (in seconds) are the values in the Redis Cache stored for

<!-- This heading can be renamed / documentation in it relocated/reorganized -->

## Conventions / Coding styles

The coding style is done automatically using the beautify extension (some basic rules are written inside `package.json`). Some other conventions are used:

- **variables/constants** - are written using _snake_case_
- **functions** - are written using _camelCase_
- **redis cache** - when a key-value pair is stored inside the redis cache, the key must be prefixed by the "target table". Ex.: if a value is part of the token cache, the key will have "token_cache-" prefix
- **json http responses** - when a json is sent as a response, it must have a field called `res_status`, with the possible values of `"success"` and `"error"`, and a `message` field. The first one is used to quickly know (in the client) if the request was successful,and the second one gives a bit more information.

## Various info

The "public" api will never expose the `email` and `password` (even if it is encrypted) of a user. The `email` address can only be accessed after the user has logged in.

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
