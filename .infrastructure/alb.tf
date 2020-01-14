//resource "aws_acm_certificate" "acm_certificate" {
//  domain_name       = var.domain
//  validation_method = "DNS"
//
//  lifecycle {
//    create_before_destroy = true
//  }
//}

data "aws_route53_zone" "route53" {
  name         = "${var.domain}."
  private_zone = false
}

//resource "aws_route53_record" "route53_record" {
//  depends_on = [aws_acm_certificate.acm_certificate]
//  name       = aws_acm_certificate.acm_certificate.domain_validation_options[0]["resource_record_name"]
//  type       = aws_acm_certificate.acm_certificate.domain_validation_options[0]["resource_record_type"]
//  # force an interpolation expression to be interpreted as a list by wrapping it
//  # in an extra set of list brackets. That form was supported for compatibility in
//  # v0.11, but is no longer supported in Terraform v0.12.
//  #
//  # If the expression in the following list itself returns a list, remove the
//  # brackets to avoid interpretation as a list of lists. If the expression
//  records = [aws_acm_certificate.acm_certificate.domain_validation_options[0]["resource_record_value"]]
//  zone_id = data.aws_route53_zone.route53.zone_id
//  ttl     = 300
//}

//resource "aws_acm_certificate_validation" "acm_certificate_validation" {
//  certificate_arn         = aws_acm_certificate.acm_certificate.arn
//  validation_record_fqdns = aws_route53_record.route53_record.*.fqdn
//}

resource "aws_route53_record" "route53_record_to_alb" {
  zone_id = data.aws_route53_zone.route53.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_alb.alb.dns_name
    zone_id                = aws_alb.alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "route53_record_cname" {
  zone_id = data.aws_route53_zone.route53.zone_id
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
    type             = "forward"
    target_group_arn = aws_alb_target_group.api_alb_target_group.arn
  }

  condition {
    field  = "path-pattern"
    values = ["/api/*"]
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

//resource "aws_alb_listener" "alb_listener_https" {
//  load_balancer_arn = aws_alb.alb.arn
//  certificate_arn   = "${aws_acm_certificate.acm_certificate.arn}"
//  protocol          = "HTTPS"
//  port              = "443"
//
//  default_action {
//    target_group_arn = aws_alb_target_group.alb_target_group.arn
//    type             = "forward"
//  }
//
//  depends_on = [aws_alb_target_group.alb_target_group]
//}
