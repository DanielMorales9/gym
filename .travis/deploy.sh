#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" -e "master" ]; then
    echo "========================="
    echo "|    Apply Terraform    |"
    echo "========================="
    sh terraform init .infrastructure/
    sh terraform plan .infrastructure/
    sh terraform apply .infrastructure/

fi