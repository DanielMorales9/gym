//resource "aws_autoscaling_group" "autoscaling_group" {
//  name                 = "${var.app_name}_asg"
//  vpc_zone_identifier  = ["${aws_subnet.public_1.id}", "${aws_subnet.public_2.id}"]
//  min_size             = "1"
//  max_size             = "2"
//  desired_capacity     = "1"
//  launch_configuration = "${aws_launch_configuration.launch_conf.name}"
//}
//
//resource "aws_launch_configuration" "launch_conf" {
//  image_id                    = "${data.aws_ami.ubuntu.id}"
//  instance_type               = "${var.instance_type}"
//  key_name                    = "${var.key_name}"
//  iam_instance_profile        = "${aws_iam_instance_profile.app.name}"
//  security_groups             = ["${aws_security_group.ec2_sg.id}"]
//  associate_public_ip_address = true
//
//  user_data = <<EOF
//#!/bin/bash
//echo 'ECS_CLUSTER=${aws_ecs_cluster.ecs_cluster.name}' > /etc/ecs/ecs.config
//start ecs
//EOF
//
//  lifecycle {
//    create_before_destroy = true
//  }
//}
//
//resource "aws_security_group" "ec2_sg" {
//  name        = "${var.app_name}_ec2_sg"
//  description = "Allow incoming HTTP connections."
//
//  ingress {
//    from_port   = 80
//    to_port     = 80
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  ingress {
//    from_port   = 443
//    to_port     = 443
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  ingress {
//    from_port   = 22
//    to_port     = 22
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  ingress {
//    from_port   = -1
//    to_port     = -1
//    protocol    = "icmp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  egress {
//    from_port   = 0
//    to_port     = 65535
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  egress {
//    from_port   = 5432                                                             # PostgreSQL
//    to_port     = 5432
//    protocol    = "tcp"
//    cidr_blocks = ["${var.private_1_subnet_cidr}", "${var.private_2_subnet_cidr}"]
//  }
//
//  egress {
//    from_port   = 6379                                                             # Redis
//    to_port     = 6379
//    protocol    = "tcp"
//    cidr_blocks = ["${var.private_1_subnet_cidr}", "${var.private_2_subnet_cidr}"]
//  }
//
//  vpc_id = "${aws_vpc.default.id}"
//
//  tags {
//    Name = "spring"
//  }
//}

