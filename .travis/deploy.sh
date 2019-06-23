#!/usr/bin/env bash

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
./terraform init .infrastructure/
./terraform plan --var-file=.infrastructure/terraform.tfvars .infrastructure/
./terraform apply --auto-approve --var-file=.infrastructure/terraform.tfvars .infrastructure/
