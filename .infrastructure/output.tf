output "db_public_ip" {
  value = "${aws_db_instance.postgres.address}"
}

output "db_username" {
  value = "${var.postgres_username}"
}

output "db_password" {
  value = "${var.postgres_password}"
}

output "db_name" {
  value = "${var.postgres_database_name}"
}

output "db_port" {
  value = "${var.postgres_port}"
}

output "redis_public_ip" {
  value = "${aws_elasticache_cluster.redis.cache_nodes.0.address}"
}
