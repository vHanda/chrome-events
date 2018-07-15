#!/usr/bin/env bash

set -eu

J='./node_modules/.bin/json2ts'
if [ ! -f $J ]; then
    echo "json2ts missing. Run npm install"
    exit 1
fi

INPUT_PATH='schemas'
OUTPUT_PATH='src/schemas'

$J $INPUT_PATH/Tab.schema.json --unreachableDefinitions > $OUTPUT_PATH/Tab.ts
$J $INPUT_PATH/Window.schema.json --unreachableDefinitions > $OUTPUT_PATH/Window.ts
$J $INPUT_PATH/Idle.schema.json --unreachableDefinitions > $OUTPUT_PATH/Idle.ts
