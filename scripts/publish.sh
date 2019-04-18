#! /bin/sh
set -e

REGISTRY_TOKEN=$1

# Publish main konnector
cozy-app-publish --token $REGISTRY_TOKEN --build-url "https://github.com/konnectors/dummy.git#build"

# Publish all flavours of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
  cozy-app-publish --token $REGISTRY_TOKEN --build-dir "./build-$d" --build-url "https://github.com/konnectors/dummy.git#build_$d"
done
