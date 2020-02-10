```bash
yarn add typescript ts-node tslint husky --dev
yarn tsc --init
yarn tslint --init

# add .gitignore

git init
git add -A
git commit -m "init project"

# add husky config:
"husky": {
  "hooks": {
    "pre-commit": "yarn tslint -c tslint.json './src/**/*.ts'"
  }
}

yarn add commander colors axios

yarn add @types/node --dev
```
