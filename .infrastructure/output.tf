output "db_public_ip" {
  value = "${aws_db_instance.postgres.address}"
}

output "redis_public_ip" {
  value = "${aws_elasticache_cluster.redis.cache_nodes.0.address}"
}
