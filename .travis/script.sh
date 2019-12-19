#!/usr/bin/env bash

mvn clean
if [[ "$TRAVIS_BRANCH" = "master" ]]; then
    echo "========================="
    echo "| Building application  |"
    echo "========================="
    mvn -ntp install
else
    echo "========================="
    echo "|  Testing application  |"
    echo "========================="
    mvn -ntp test
fi
