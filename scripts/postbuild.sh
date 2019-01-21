#! /bin/sh
set -e

# Generate all flavous of Dummy
find flavours/* -prune -type d -exec basename {} \; | while IFS= read -r d; do
    rm -Rf "build-$d"
    cp -R build "build-$d"
    jq -s '.[0] + .[1]' "build-$d/manifest.konnector" "flavours/$d/manifest.fragment.json" > "build-$d/manifest.temp"
    rm "build-$d/manifest.konnector"
    mv "build-$d/manifest.temp" "build-$d/manifest.konnector"
done
