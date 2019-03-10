#!/usr/bin/env bash

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
sh terraform init .infrastructure/
sh terraform plan .infrastructure/
sh terraform apply .infrastructure/