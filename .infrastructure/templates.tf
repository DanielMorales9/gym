data "aws_ami" "ecs-opt" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-2.0.20190402-x86_64-ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = []
}

data "template_file" "instance_profile" {
  template = "${file("${path.module}/policies/instance-profile-policy.json")}"

  vars {
    app_log_group_arn = "${aws_cloudwatch_log_group.cloudwatch_log_group.arn}"
  }
}


data "template_file" "task_definition" {
  template = "${file("${path.module}/templates/tasks/app.json")}"

  vars {
    image_url      = "${var.account_id}.dkr.ecr.eu-central-1.amazonaws.com/app:0.0.1-SNAPSHOT"
    container_name = "app"

    log_group_region = "${var.aws_region}"
    log_group_name   = "${aws_cloudwatch_log_group.cloudwatch_log_group.name}"

    gmail_password    = "${var.gmail_password}"
    gmail_username    = "${var.gmail_username}"
    postgres_host     = "${aws_db_instance.postgres.address}"
    postgres_password = "${var.postgres_password}"
    postgres_username = "${var.postgres_username}"
    redis_host        = "${aws_elasticache_cluster.redis.cache_nodes.0.address}"
    url               = "${var.url}"
  }
}
