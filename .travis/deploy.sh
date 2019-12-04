#!/usr/bin/env bash

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
./terraform init .infrastructure/
./terraform plan .infrastructure/
./terraform apply --auto-approve .infrastructure/
