#!/usr/bin/env bash
set -ex

mvn clean
if [[ "$TRAVIS_BRANCH" = "master" ]]; then
    echo "========================="
    echo "| Building application  |"
    echo "========================="
    mvn -ntp clean install
else
    echo "========================="
    echo "|  Testing application  |"
    echo "========================="
    mvn -ntp clean test
fi
