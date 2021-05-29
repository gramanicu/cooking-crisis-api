# /user API

The user api is divided into two categories: public and private. The public api is accessed without a user logon, but the private api requires a token.

## "Public" `/users` routes

As defined in [#15](https://github.com/gramanicu/cooking-crisis-api/issues/15), these routes are related to the user accounts, but they don't expose private data (mostly because most of the routes are related to account creation anyway). The following routes are implemented:

-   **GET `../users/exists/:username`** - check if a user exists. His username (IGN) must be specified. The name is provided inside the path (`/:username`)

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

-   **GET `../users/status/:username`** - check the status of a user. His username (IGN) must be specified. The status is returned as a number. See the `user_status` constant for more information.

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,

        // The status of the found user
        "status": Number?
      }
    ```

-   **GET `../users/activation/:activation_token`** - activate an account, the one that has this specific `activation_token`. It expires in a specific amount of time (3 days, after that the account is deleted)

    Response format:

    ```js
      {
        "res_status": String,
        "message": String
      }
    ```

-   **POST `../users/new`** - create a new "_player_" account. If successful, an activation link will be sent via email, available for 3 days. During this time, the account is **reserved**, but doesn't actually exist. The data must be sent in the request body in the following json format:

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

-   **POST `../users/signin`** - sign in into an account (player or admin). For the login, only the IGN can be used. However, the sign in is case insensitive. The data must be sent in the request body in the following json format:

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

-   **GET `../users/token/:refresh_token`** - obtain a new `jwt_access_token`, only if the current one has spent more than 1/2 of it's "TTL". If the condition is not met, the current token is returned (not a new one). The refresh_token is provided inside the path (`/:refresh_token`)

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

## "Private" `/users` routes\*\*

These routes are related to the user accounts, and can be accessed only after obtaining the `jwt_access_token`. The token must be passed inside the _headers_, in the `Authorization` field, with the `Bearer` type ("Authorization" = "Bearer `<auth token>`").

-   **GET `../users/account`** - get the account data (only the data that is relevant to the user)

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

-   **PATCH `../users/password`** - change the password of the authenticated user.

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

-   **PATCH `../users/signout`** - signs out the authenticated user. It will change his status to offline and remove the `jwt_refresh_token`, among other things.

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

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
