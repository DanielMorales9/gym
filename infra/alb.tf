locals {
  validation_options = tolist(aws_acm_certificate.default.domain_validation_options)
}

resource "aws_acm_certificate" "default" {
  domain_name               = var.domain
  validation_method         = "DNS"
  subject_alternative_names = ["*.${var.domain}"]

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "public" {
  name         = "${var.domain}."
  private_zone = false
}

resource "aws_route53_record" "route53_record" {
  depends_on = [aws_acm_certificate.default]
  name       = local.validation_options.0.resource_record_name
  type       = local.validation_options.0.resource_record_type
  records    = [local.validation_options.0.resource_record_value]
  zone_id    = data.aws_route53_zone.public.zone_id
  ttl        = 300
}

resource "aws_acm_certificate_validation" "acm_certificate_validation" {
  certificate_arn         = aws_acm_certificate.default.arn
  validation_record_fqdns = aws_route53_record.route53_record.*.fqdn
}

resource "aws_route53_record" "route53_record_to_alb" {
  zone_id = data.aws_route53_zone.public.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_alb.alb.dns_name
    zone_id                = aws_alb.alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "route53_record_cname" {
  zone_id = data.aws_route53_zone.public.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  ttl     = 300

  records = [var.domain]
}


resource "aws_alb" "alb" {
  name            = "${var.app_name}-alb-ecs"
  subnets         = aws_subnet.ecs_subnet.*.id
  security_groups = [aws_security_group.alb_security_group.id]

  tags = {
    Project = var.app_name
  }
}

resource "aws_alb_listener" "listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = 80

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.web_alb_target_group.arn
  }

}

resource "aws_alb_listener_rule" "api" {
  listener_arn = aws_alb_listener.listener.arn
  priority     = 100

  action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_alb_listener" "listener_https" {
  load_balancer_arn = aws_alb.alb.arn
  certificate_arn   = aws_acm_certificate.default.arn
  protocol          = "HTTPS"
  port              = "443"

  default_action {
    target_group_arn = aws_alb_target_group.web_alb_target_group.arn
    type             = "forward"
  }

  depends_on = [aws_alb_target_group.web_alb_target_group]
}

resource "aws_alb_listener_rule" "api_https" {
  listener_arn = aws_alb_listener.listener_https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.api_alb_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_alb_target_group" "web_alb_target_group" {
  name     = "web-alb-target-group"
  vpc_id   = aws_vpc.default.id
  protocol = "HTTP"
  port     = "8080"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Project = var.app_name
  }
}

resource "aws_alb_target_group" "api_alb_target_group" {
  name     = "${var.app_name}-alb-target-group"
  vpc_id   = aws_vpc.default.id
  protocol = "HTTP"
  port     = "80"

  lifecycle {
    create_before_destroy = true
  }

  health_check {
    path                = "/api/actuator/health"
    port                = 80
    protocol            = "HTTP"
    healthy_threshold   = 10
    unhealthy_threshold = 10
    matcher             = "200-308"
  }

  tags = {
    Project = var.app_name
  }
}

