#!/usr/bin/env bash
set -ex

echo "========================="
echo "|    Apply Terraform    |"
echo "========================="
./terraform -chdir=.infrastructure init
./terraform -chdir=.infrastructure plan
./terraform -chdir=.infrastructure apply --auto-approve
