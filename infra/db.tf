resource "aws_db_instance" "postgres" {
  name                = var.postgres_db
  engine              = "postgres"
  engine_version      = "10.10"
  deletion_protection = true

  instance_class         = var.rds_instance
  allocated_storage      = 5
  storage_encrypted      = false
  multi_az               = var.multi_az
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  db_subnet_group_name   = aws_db_subnet_group.rds_db_subnet_group.name
  parameter_group_name   = aws_db_parameter_group.default.name

  storage_type        = "gp2"
  username            = var.postgres_username
  password            = var.postgres_password
  port                = var.postgres_port
  publicly_accessible = true

  allow_major_version_upgrade = false
  auto_minor_version_upgrade  = false
  apply_immediately           = true

  # disable backups to create DB faster
  skip_final_snapshot     = true
  backup_retention_period = 0

  tags = {
    Name    = "db"
    Project = var.app_name
  }
}

resource "aws_db_parameter_group" "default" {
  name   = "${var.postgres_db}-postgres10"
  family = "postgres10"

  parameter {
    name  = "log_min_duration_statement"
    value = 0
  }

  parameter {
    name  = "log_statement"
    value = "all"
  }
}

resource "aws_db_subnet_group" "rds_db_subnet_group" {
  name       = "${var.app_name}_db_subnet_group"
  subnet_ids = aws_subnet.rds_subnet.*.id

  tags = {
    Project = var.app_name
  }
}

