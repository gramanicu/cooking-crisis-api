# /friends API

The friends api is somewhat related to the user api. All its routes are private, so they require the access token. The following routes exist:

-   **POST `../friends/add/:username`** - Send a friend request to a user. The IGN of the user is provided inside the path (`/:username`)

    Response format:

    ```js
      {
        "res_status": String,
        "message": String
      }
    ```

-   **PUT `../friends/answer`** - Respond to an incoming friend request. The data must be sent in the request body in the following json format:

    Request body:

    ```js
      {
        // The id of the request (it will also be the id of the friendship, if the request is accepted)
        "request_id": String,

        // The answer to the request. The possible values are:
        // "accept" or "deny"
        "answer": String
      }
    ```

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,
      }
    ```

-   **GET `../friends/requests`** - Get all pending requests for this user (the request_id and the name of the sender). The array will be empty if no requests are found, and the "ret_status" will be "success"

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,
        "data": [
            "sender": String,
            "req_id": String
        ]
      }
    ```

-   **GET `../friends/list`** - Get the list of friends for this user(the link_id/friendship id and the name of the friend). The array will be empty if no requests are found, and the "ret_status" will be "success"

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,
        "data": [
            "name": String,
            "link_id": String
        ]
      }
    ```

-   **DELETE `../friends/remove/:link_id`** - Remove a friend. This will be done using the `link_id`/friendship id. The link_id coincides with the request_id (created when the friend request was created).

    Response format:

    ```js
      {
        "res_status": String,
        "message": String
      }
    ```

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
