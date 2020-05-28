#!/usr/bin/env bash
set -e

echo "==================================="
echo "|  Taint and Deploy Latest Version|"
echo "==================================="
./terraform destroy --target=aws_ecs_cluster.ecs_cluster \
    --target=aws_elasticache_cluster.redis --auto-approve .infrastructure/
./terraform plan .infrastructure/
./terraform apply --auto-approve .infrastructure/
