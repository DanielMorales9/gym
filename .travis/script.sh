#!/usr/bin/env bash

mvn clean
if [[ "$TRAVIS_BRANCH" = "master" ]]; then
    echo "========================="
    echo "| Building application  |"
    echo "========================="
    mvn -nXtp clean install
else
    echo "========================="
    echo "|  Testing application  |"
    echo "========================="
    mvn -nXtp clean test
fi
