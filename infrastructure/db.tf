resource "aws_db_instance" "postgres" {
  name                   = "${var.postgres_database_name}"
  engine                 = "postgres"
  engine_version         = "10.5"
  instance_class         = "${var.rds_instance}"
  allocated_storage      = 5
  storage_encrypted      = false
  multi_az               = "${var.multi_az}"
  vpc_security_group_ids = ["${aws_security_group.rds_security_group.id}"]
  db_subnet_group_name   = "${aws_db_subnet_group.rds_db_subnet_group.name}"
  parameter_group_name   = "default.postgres10"

  storage_type        = "gp2"
  username            = "${var.postgres_username}"
  password            = "${var.postgres_password}"
  port                = "${var.postgres_port}"
  publicly_accessible = false

  allow_major_version_upgrade = false
  auto_minor_version_upgrade  = false
  apply_immediately           = true

  # disable backups to create DB faster
  skip_final_snapshot     = true
  backup_retention_period = 0

  tags = {
    Name = "db"
  }
}

resource "aws_db_subnet_group" "rds_db_subnet_group" {
  name       = "${var.app_name}_db_subnet_group"
  subnet_ids = ["${aws_subnet.rds_subnet.*.id}"]
}

//resource "aws_db_subnet_group" "db_subnet_group" {
//  name       = "${var.app_name}_db_subnet_group"
//  subnet_ids = ["${aws_subnet.private_subnet.*.id}"]
//
//  tags = {
//    Name = "postgres subnet"
//  }
//}


//resource "aws_security_group" "db_security_group" {
//  name        = "${var.app_name}_db_sg"
//  vpc_id      = "${aws_vpc.default.id}"
//  description = "Allow incoming database connections."
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
//    security_groups = ["${aws_security_group.default.id}"]
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
//    Name = "postgres"
//  }
//}

