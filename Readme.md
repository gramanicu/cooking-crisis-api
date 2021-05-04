# Cooking Crisis API

The backend server for the Cooking Crisis game.

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

There is a special route, that returns this documentation, _"/docs"_. All the other api routes are of the form _"/api/{`version`}/..."_. They will be documented in the following section.

**"Public" `/users` routes**

As defined in [#15](https://github.com/gramanicu/cooking-crisis-api/issues/15), these routes are related to the user accounts, but they don't expose private data (mostly because most of the routes are related to account creation anyway). The following routes are implemented

- `../users/exists/:username` - check if a user exists. His username (IGN) must be specified. The IGN is provided as a _request parameter_
- `../users/status/:username` - check the status of a user. His username (IGN) must be specified. The IGN is provided as a _request parameter_
- `../users/activation/:activation_token` - activate the user's account. This link is received in the provided email, after account creation. The token is provided as a _request parameter_.
- `../users/new` - create a new "_player_" account. The data must be sent in the request body in the following json format:

  ```js
    {
        "username": "user",
        "password": "12abCD-.",
        "email": "example@email.com"
    }
  ```

  There are the following restrictions:
  - `username` - alphanumeric characters + "_.#&+-". The length must be between 1 and 16 chars (inclusively)
  - `password` - the password must contain at least one uppercase, one lowercase and once special character. It must also contain a number and it's length must be at least 8 characters (maximum 32)
  - `email` - must be a valid email address (all addresses should be supported)
  
  If this operation was successful, a new account is created. However, until the email address is not verified (by accessing the link sent to the address), the account is not accessible. Furthermore, if the link expires (after 3 days), the account will be deleted and the **sign up** process must be started over.

- `../users/signin` - sign in into an account (player or admin). For the login, only the IGN can be used. However, the sign in is case insensitive. The data must be sent in the request body in the following json format:

  ```js
    {
        "username": "user",
        "password": "12abCD-.",
    }
  ```

  The request will return (among other stuff), if successful, the JWT token used to access the _private user routes_.

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
    "isAdmin": Boolean,
    "activated": Boolean,
    
    // These are not required, as they are 
    // deleted after the account is created
    "activation_token": String,
    "activation_expiry": Date,
}
```

<!-- This heading can be renamed / documentation in it relocated/reorganized -->
## Various info

The "public" api will never expose the `email` and `password` (even if it is encrypted) of a user. The `email` address can only be accessed after the user has logged in.

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
