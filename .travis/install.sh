#!/usr/bin/env bash

echo "=========================="
echo "| Installing Dependencies |"
echo "=========================="
sudo apt-get autoremove -y

if [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "========================="
    echo "|  Installing AWS-CLI   |"
    echo "========================="
    sudo snap install aws-cli --classic
fi

if [ "$TRAVIS_PULL_REQUEST" = "true" ] || [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "========================="
    echo "|  Installing Terraform |"
    echo "========================="
    wget https://releases.hashicorp.com/terraform/0.11.12/terraform_0.11.12_linux_amd64.zip
    unzip terraform_0.11.12_linux_amd64.zip
fi
