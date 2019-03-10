#!/usr/bin/env bash

if [ "$TRAVIS_PULL_REQUEST" = "true" ] || [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "========================="
    echo "| Building application  |"
    echo "========================="
    mvn install
else
    echo "========================="
    echo "|  Testing application  |"
    echo "========================="
    mvn test
fi