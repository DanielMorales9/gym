resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "${var.app_name}-redis"
  engine          = "redis"
  node_type       = var.redis_node_type
  port            = var.redis_port
  num_cache_nodes = 1

  security_group_ids = [aws_security_group.cache_security_group.id]
  subnet_group_name  = aws_elasticache_subnet_group.cache_subnet_group.name

  tags = {
    Name    = "cache"
    Project = var.app_name
  }
}

resource "aws_elasticache_subnet_group" "cache_subnet_group" {
  name       = "${var.app_name}-cache-subnet-group"
  subnet_ids = aws_subnet.cache_subnet.*.id
}

//resource "aws_security_group" "cache_security_group" {
//  name        = "${var.app_name}-cache-sg"
//  description = "Allow incoming redis connections."
//  vpc_id      = "${aws_vpc.default.id}"
//
//  ingress {
//    from_port       = 6379
//    to_port         = 6379
//    protocol        = "tcp"
//    security_groups = ["${aws_security_group.default.id}"]
//  }
//
//  // allows traffic from the SG itself
//  ingress {
//    from_port = 0
//    to_port   = 0
//    protocol  = "-1"
//    self      = true
//  }
//
//  //allow traffic for TCP 5432
//  ingress {
//    from_port       = 5432
//    to_port         = 5432
//    protocol        = "tcp"
//    security_groups = ["${aws_security_group.db_security_group.id}"]
//  }
//
//  // outbound internet access
//  egress {
//    from_port   = 0
//    to_port     = 0
//    protocol    = "-1"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  tags {
//    Name = "redis"
//  }
//}
