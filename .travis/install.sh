#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "========================="
    echo "|  Installing AWS-CLI   |"
    echo "========================="
    sudo snap install aws-cli --classic
    echo "========================="
    echo "|  Installing Terraform |"
    echo "========================="
    wget https://releases.hashicorp.com/terraform/0.11.13/terraform_0.11.13_linux_amd64.zip
    unzip terraform_0.11.13_linux_amd64.zip
fi


