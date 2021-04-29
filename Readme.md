# Cooking Crisis API

The backend server for the Cooking Crisis game.

## Project structure

The server logic is found in the "_server/_" folder. It's organized in the following manner:

- _constants/_ - all the constants used inside the code (not "_const_" datatype, but hardcoded constants)
- _controllers/_ - <!-- TODO - add information -->
- _middleware/_ - different middleware used (e.g. Redis Caching)
- _routes/_ - the routes used by the api. They are further separated into different versions.
- _services/_ -  <!-- TODO - add information -->

Inside the configs file we can found different configuration files. <!-- TODO - whether all of them are included in the repository (if the contains keys, etc..) -->

## API

### Routes

There is a special route, for the documentation, _"/docs"_. All the other api routes are of the form _"/api/{`version`}/..."_. They will be documented in the following section.

<!-- TODO - add the routes -->

## Sources

The project structure is partly inspired by [this repo](https://github.com/kelyvin/express-env-example)

© 2021 Doxa Studios (Grama Nicolae, Chifan Cristian, Vitoga Patrick)
