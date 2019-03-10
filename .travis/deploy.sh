#!/usr/bin/env bash

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
bash terraform init .infrastructure/
bash terraform plan .infrastructure/
bash terraform apply .infrastructure/