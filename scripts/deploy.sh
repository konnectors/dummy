#! /bin/sh
set -e

DEPLOY_REPOSITORY=$1

# Deploy main konnector
git-directory-deploy --directory build/ --branch build --repo="$DEPLOY_REPOSITORY",

# Deploy all flavous of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
  git-directory-deploy --directory "build-$d/" --branch "build_$d" --repo="$DEPLOY_REPOSITORY"
done
