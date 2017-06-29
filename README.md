# eslint-import-resolver-react-native
eslint-plugin-import resolver for react-native that tries to resolve .ios.js and .android.js if import is not resolved


##Install

```
npm i eslint-import-resolver-react-native --save-dev

```

## .eslintrc

```
{
  ...
  settings: {
    "import/resolver": "react-native"
  }
  ...
}
```

## Options

platform: 'both' || 'ios' || 'android' || 'any'  
default = 'both'

'both'    - .ios and .android file needs to be present to resolve  
'any'     - .ios and/or .android file needs to be present to resolve  
'ios'     - only looks for .ios files  
'android' - only looks for .android files
```
{
  ...
  settings: {
    "import/resolver": {
      "react-native": {platform: 'ios'}
    }
  }
  ...
}
```
