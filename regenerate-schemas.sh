#!/usr/bin/env bash

set -eu

J='./node_modules/.bin/json2ts'
if [ ! -f $J ]; then
    echo "json2ts missing. Run npm install"
    exit 1
fi

INPUT_PATH='schemas'
OUTPUT_PATH='src/schemas'

for f in `ls $INPUT_PATH | grep .schema.json` ; do
    filename=$(basename -- "$f")
    filename="${filename%.*}"
    sname="${filename%.*}"

    set -x
    $J $INPUT_PATH/$sname.schema.json --unreachableDefinitions > $OUTPUT_PATH/$sname.ts
    set +x

done
