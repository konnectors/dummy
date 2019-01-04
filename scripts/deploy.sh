#! /bin/sh
set -e

GITHUB_TOKEN=$1

# Deploy main konnector
git-directory-deploy --directory build/ --branch build --repo="https://$GITHUB_TOKEN@github.com/konnectors/dummy.git",

# Deploy all flavous of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
  git-directory-deploy --directory "build-$d/" --branch "build_$d" --repo="https://$GITHUB_TOKEN@github.com/konnectors/dummy.git"
done
