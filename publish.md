yarn eslint --fix
yarn build
git add .
git commit -m "patch"
git push origin main
npm version patch
npm publish