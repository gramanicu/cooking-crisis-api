# /friends API

The friends api is somewhat related to the user api. All its routes are private, so they require the access token. The following routes exist:


-   **GET `../cards/view`** - Get all cards. Data contains an array of all available cards from database.

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,
        "data": [Card]
      }
    ```

-   **GET `../card/view/:cardid`** - Get a card by id. The id is provided inside the path (`/:cardid`)

    Response format:

    ```js
      {
        "res_status": String,
        "message": String,
        "data": Card
      }
    ```

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
