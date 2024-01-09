#!/bin/bash

#echo "[" >> result.json

while true
do
    echo "name"
    read name

    echo "desc"
    read desc

    echo "{ \"name\": \"$name\", \"desc\": \"$desc\" }," >> result.json
done

#echo "]" >> result.json