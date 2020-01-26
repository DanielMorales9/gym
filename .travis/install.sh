#!/usr/bin/env bash

wget "https://archive.apache.org/dist/maven/maven-3/${MVN_VERSION}/binaries/apache-maven-${MVN_VERSION}-bin.zip"
unzip -qq "apache-maven-${MVN_VERSION}-bin.zip"

if [[ "${TRAVIS_BRANCH}" = "master" ]]; then
    echo "========================="
    echo "|  Installing AWS-CLI   |"
    echo "========================="
    sudo snap install aws-cli --classic
    echo "========================="
    echo "|  Installing Terraform |"
    echo "========================="
    TF_ZIP="terraform_${TF_VERSION}_linux_amd64.zip"
    TF_URI="https://releases.hashicorp.com/terraform/${TF_VERSION}/${TF_ZIP}"
    wget "${TF_URI}"
    unzip "${TF_ZIP}"
fi


