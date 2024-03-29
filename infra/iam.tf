data "aws_iam_policy_document" "ecs_service_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ecs.amazonaws.com",
        "ec2.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "ecs_role" {
  name               = "ecs_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_service_role.json
}

data "aws_iam_policy_document" "ecs_service_policy" {
  statement {
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "elasticloadbalancing:*",
      "ec2:*",
      "ecs:*",
    ]
  }
}

/* ecs service scheduler role */
resource "aws_iam_role_policy" "ecs_service_role_policy" {
  name = "ecs_service_role_policy"

  #policy = "${file("${path.module}/policies/ecs-service-role.json")}"
  policy = data.aws_iam_policy_document.ecs_service_policy.json
  role   = aws_iam_role.ecs_role.id
}

/* role that the Amazon ECS container agent and the Docker daemon can assume */
resource "aws_iam_role" "ecs_execution_role" {
  name               = "ecs_task_execution_role"
  assume_role_policy = file("${path.module}/policies/ecs-task-execution-role.json")
}

resource "aws_iam_role_policy" "ecs_execution_role_policy" {
  name   = "ecs_execution_role_policy"
  policy = file("${path.module}/policies/ecs-execution-role-policy.json")
  role   = aws_iam_role.ecs_execution_role.id
}

resource "aws_iam_role" "ecs_autoscale_role" {
  name               = "ecs_autoscale_role"
  assume_role_policy = file("${path.module}/policies/ecs-autoscale-role.json")
}

resource "aws_iam_role_policy" "ecs_autoscale_role_policy" {
  name   = "ecs_autoscale_role_policy"
  policy = file("${path.module}/policies/ecs-autoscale-role-policy.json")
  role   = aws_iam_role.ecs_autoscale_role.id
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecs-instance-profile"
  path = "/"
  role = aws_iam_role.ecs_role.id
}

