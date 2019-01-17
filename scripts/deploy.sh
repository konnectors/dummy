#! /bin/sh
set -e

# Deploy main konnector
yarn git-directory-deploy --directory build/ --branch build --repo="$DEPLOY_REPOSITORY"

# Deploy all flavous of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
  yarn git-directory-deploy --directory "build-$d/" --branch "build_$d" --repo="$DEPLOY_REPOSITORY"
done
