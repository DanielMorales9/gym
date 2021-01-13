#!/usr/bin/env bash

echo "========================="
echo "|  Installing MAVEN     |"
echo "========================="
MAVEN_ZIP="apache-maven-${MVN_VERSION}-bin.zip"
wget "https://archive.apache.org/dist/maven/maven-3/${MVN_VERSION}/binaries/${MAVEN_ZIP}"
unzip -qq "${MAVEN_ZIP}"

echo "========================="
echo "|  Installing AWS-CLI   |"
echo "========================="
sudo snap install aws-cli --classic

echo "========================="
echo "|  Installing Terraform |"
echo "========================="
TF_ZIP="terraform_${TF_VERSION}_linux_amd64.zip"
wget "https://releases.hashicorp.com/terraform/${TF_VERSION}/${TF_ZIP}"
unzip "${TF_ZIP}"


