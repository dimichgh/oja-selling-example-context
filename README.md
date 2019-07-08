# oja-selling-example-context

An example of structuring app business logic using [oja](https://github.com/dimichgh/oja) actions.

This is a demo application that shows how application business logic can be structured into independent, shareable actions that can be tested independently and later used to compose more complex actions/pages/responses.

## Usage

### Install
```bash
npm install
```

### Running tests

```bash
npm test
```

### Running app
```bash
node .
```

### Creating new action

```bash
npx hygen action new <domain>/<actionName>
# example
npx hygen action new consumer/buy
```

The output would be
```
Loaded templates: _templates
       added: src/actions/consumer/buy/unit-test/index.spec.js
       added: src/actions/consumer/buy/index.js
```