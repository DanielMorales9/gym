#!/usr/bin/env bash
set -ex

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
./terraform -chdir=infra init
./terraform -chdir=infra plan
./terraform -chdir=infra apply --auto-approve
