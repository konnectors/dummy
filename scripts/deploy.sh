#! /bin/sh
set -e

# Deploy main konnector
yarn git-directory-deploy --directory build/ --branch build --repo="git@github.com:konnectors/dummy.git",

# Deploy all flavous of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
  yarn git-directory-deploy --directory "build-$d/" --branch "build_$d" --repo="git@github.com:konnectors/dummy.git"
done
