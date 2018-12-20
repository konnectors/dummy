#! /bin/sh
set -e

# Generate all flavous of Dummy

# Dummy Aggregator
rm -Rf build-aggregator
cp -R build build-aggregator
jq -s '.[0] * .[1]' build-aggregator/manifest.konnector flavours/aggregator/manifest.fragment.json > build-aggregator/manifest.temp
rm build-aggregator/manifest.konnector
mv build-aggregator/manifest.temp build-aggregator/manifest.konnector
