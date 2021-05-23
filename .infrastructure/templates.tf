data "aws_ami" "ecs-opt" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-2.0.20191114-x86_64-ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["591542846629"]
}

data "template_file" "instance_profile" {
  template = file("${path.module}/policies/instance-profile-policy.json")

  vars = {
    app_log_group_arn = aws_cloudwatch_log_group.cloudwatch_log_group.arn
  }
}

data "template_file" "api_task_definition" {
  template = file("${path.module}/templates/tasks/app.json")

  vars = {
    image_url         = "${var.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/app:0.0.1-SNAPSHOT"
    container_name    = "app"
    log_group_region  = var.aws_region
    log_group_name    = aws_cloudwatch_log_group.cloudwatch_log_group.name
    gmail_password    = var.gmail_password
    admin_password    = var.admin_password
    admin_email       = var.admin_email
    gmail_username    = var.gmail_username
    app_name          = var.app_name
    postgres_host     = aws_db_instance.postgres.address
    postgres_db       = var.postgres_db
    postgres_password = var.postgres_password
    postgres_username = var.postgres_username
    redis_host        = aws_elasticache_cluster.redis.cache_nodes[0].address
    redis_port        = aws_elasticache_cluster.redis.cache_nodes[0].port
    url               = "https://www.${var.domain}"
    remember_me_token = var.remember_me_token
  }
}

data "template_file" "web_task_definition" {
  template = file("${path.module}/templates/tasks/web.json")

  vars = {
    image_url        = "${var.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/web:0.0.1-SNAPSHOT"
    container_name   = "web"
    log_group_region = var.aws_region
    log_group_name   = aws_cloudwatch_log_group.cloudwatch_log_group.name
  }
}
