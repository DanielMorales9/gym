resource "aws_ecr_repository" "ecr_repository" {
  name = "app"

  tags {
    Project = "${var.app_name}"
  }
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.app_name}_ecs_cluster"
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                = "${var.app_name}_ecs_task_definition"
  container_definitions = "${data.template_file.task_definition.rendered}"
  execution_role_arn    = "${aws_iam_role.ecs_execution_role.arn}"
  task_role_arn         = "${aws_iam_role.ecs_execution_role.arn}"

  //  requires_compatibilities = ["FARGATE"]
  //  network_mode             = "awsvpc"
  //  cpu                      = 256
  //  memory                   = 512

  tags {
    Project = "${var.app_name}"
  }
}

resource "aws_ecs_service" "ecs_service" {
  depends_on = [
    "aws_ecs_task_definition.ecs_task_definition",
    "aws_cloudwatch_log_group.cloudwatch_log_group",
    "aws_iam_role_policy.ecs_service_role_policy",
    "aws_alb_target_group.alb_target_group",
    "aws_alb_listener.alb_listener",
  ]

  name            = "${var.app_name}_ecs_service"
  cluster         = "${aws_ecs_cluster.ecs_cluster.id}"
  task_definition = "${aws_ecs_task_definition.ecs_task_definition.arn}"
  desired_count   = 1

//  network_configuration {
//    assign_public_ip = true
//    security_groups  = ["${aws_security_group.ecs_security_group.id}"]
//    subnets          = ["${aws_subnet.ecs_subnet.*.id}"]
//  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.alb_target_group.id}"
    container_name   = "app"
    container_port   = "${var.task_port}"
  }
}
