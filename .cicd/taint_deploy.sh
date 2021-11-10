#!/usr/bin/env bash
set -ex

echo "==================================="
echo "|  Taint and Deploy Latest Version|"
echo "==================================="
./terraform -chdir=.infrastructure/ destroy --target=aws_ecs_cluster.ecs_cluster \
    --target=aws_elasticache_cluster.redis --auto-approve
./terraform -chdir=.infrastructure/ plan
./terraform -chdir=.infrastructure/ apply --auto-approve
