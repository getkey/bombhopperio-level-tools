# BombHopper.io level tools

![npm](https://img.shields.io/npm/v/bombhopperio-level-tools)

This library is used to validate levels. Maybe it will have more level-related features later, like upgrading from an old format version into a newer.

```sh
yarn add bombhopperio-level-tools
```

or

```sh
npm install bombhopperio-level-tools
```

## CLI tool

```sh
bombhopperio-level-tools validate file.json other_file.json as_many_files_as_you_want.json
```

## JS API

### validate(levelObject)

```js
import { validate } from 'bombhopperio-level-tools';

const formatVersionNumber = validate(myLevelObject); // throws an error if the file is invalid
```
