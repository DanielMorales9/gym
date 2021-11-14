resource "aws_autoscaling_group" "autoscaling_group" {
  name                 = "${var.app_name}_asg"
  vpc_zone_identifier  = aws_subnet.ecs_subnet.*.id
  min_size             = var.min_size
  max_size             = var.max_size
  desired_capacity     = var.desired_capacity
  launch_configuration = aws_launch_configuration.launch_conf.name
  health_check_type    = "ELB"
}

data "template_file" "ecs_user_data" {
  template = file("${path.module}/templates/ecs-userdata.tpl")

  vars = {
    ecs_cluster_name = aws_ecs_cluster.ecs_cluster.name
  }
}

resource "aws_launch_configuration" "launch_conf" {
  image_id                    = data.aws_ami.ecs-opt.id
  instance_type               = var.instance_type
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.ecs_instance_profile.id
  security_groups             = [aws_security_group.ecs_security_group.id]
  associate_public_ip_address = true

  user_data = data.template_file.ecs_user_data.rendered

  lifecycle {
    create_before_destroy = true
  }
}

