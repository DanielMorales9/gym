resource "aws_alb_target_group" "alb_target_group" {
  name        = "${var.app_name}-alb-target-group"
  vpc_id      = "${aws_vpc.default.id}"
  protocol    = "HTTP"
  port        = "80"
  target_type = "ip"

  lifecycle {
    create_before_destroy = true
  }

    health_check {
      path = "/health"
      port = "80"
      protocol = "HTTP"
      healthy_threshold = 10
      unhealthy_threshold = 10
      matcher = "200-308"
    }
}

resource "aws_alb" "alb" {
  name            = "${var.app_name}-alb-ecs"
  subnets         = ["${aws_subnet.ecs_subnet.*.id}"]
  security_groups = ["${aws_security_group.alb_security_group.id}"]
}

resource "aws_alb_listener" "alb_listener" {
  load_balancer_arn = "${aws_alb.alb.arn}"
  port              = "80"
  protocol          = "HTTP"
  depends_on        = ["aws_alb_target_group.alb_target_group"]

  default_action {
    target_group_arn = "${aws_alb_target_group.alb_target_group.arn}"
    type             = "forward"
  }
}

//resource "aws_security_group" "alb_security_group" {
//  name        = "${var.app_name}_alb_sg"
//  description = "controls access to the application ELB"
//  vpc_id      = "${aws_vpc.default.id}"
//
//  ingress {
//    from_port   = 80
//    to_port     = 80
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  ingress {
//    from_port   = 8
//    to_port     = 0
//    protocol    = "icmp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  egress {
//    from_port   = 0
//    to_port     = 0
//    protocol    = "-1"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//}

