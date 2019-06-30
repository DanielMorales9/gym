#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "========================="
    echo "| Building application  |"
    echo "========================="
    mvn -B install
else
    echo "========================="
    echo "|  Testing application  |"
    echo "========================="
    mvn -B test
fi
