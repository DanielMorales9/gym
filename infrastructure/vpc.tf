# VPC
# ===
resource "aws_vpc" "default" {
  cidr_block           = "${var.vpc_cidr}"
  enable_dns_hostnames = true

  tags {
    Name = "vpc"

    Project = "${var.app_name}"
  }
}

# IGW Instance
# ============
resource "aws_internet_gateway" "gw" {
  vpc_id = "${aws_vpc.default.id}"

  tags {
    Project = "${var.app_name}"
  }
}

# RDS Subnet
# ==========
resource "aws_subnet" "rds_subnet" {
  vpc_id            = "${aws_vpc.default.id}"
  count             = "${length(var.availability_zones)}"
  cidr_block        = "${cidrsubnet(aws_vpc.default.cidr_block, 8, count.index)}"
  availability_zone = "${element(var.availability_zones, count.index)}"

  tags {
    Name = "${element(var.availability_zones, count.index)}-rds-subnet"

    Project = "${var.app_name}"
  }
}

# CACHE Subnet
# ============
resource "aws_subnet" "cache_subnet" {
  vpc_id            = "${aws_vpc.default.id}"
  count             = "${length(var.availability_zones)}"
  cidr_block        = "${cidrsubnet(aws_vpc.default.cidr_block, 8, var.az_count + count.index)}"
  availability_zone = "${element(var.availability_zones, var.az_count + count.index)}"

  tags {
    Name    = "${element(var.availability_zones, count.index)}-cache-subnet"
    Project = "${var.app_name}"
  }
}

# ECS Subnet
# ==========
resource "aws_subnet" "ecs_subnet" {
  vpc_id                  = "${aws_vpc.default.id}"
  count                   = "${length(var.availability_zones)}"
  cidr_block              = "${cidrsubnet(aws_vpc.default.cidr_block, 8, 2*var.az_count + count.index)}"
  availability_zone       = "${element(var.availability_zones, count.index)}"
  map_public_ip_on_launch = true

  tags {
    Name    = "${element(var.availability_zones, count.index)}-ecs-subnet"
    Project = "${var.app_name}"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.default.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.gw.id}"
}

# ==================
# ALB Security group
# ALB   to  Internet
# ==================
resource "aws_security_group" "alb_security_group" {
  name        = "${var.app_name}_alb_sg"
  description = "Allow access on port 80 only to ALB"
  vpc_id      = "${aws_vpc.default.id}"

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }


  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8
    to_port     = 0
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==================
# ALB Security group
# ALB   to       ECS
# ==================
resource "aws_security_group" "ecs_security_group" {
  name        = "${var.app_name}_ecs_sg"
  description = "allow inbound access from the ALB only"
  vpc_id      = "${aws_vpc.default.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "80"
    to_port         = "${var.task_port}"
    security_groups = ["${aws_security_group.alb_security_group.id}"]
  }

  ingress {
    protocol        = "tcp"
    from_port       = "22"
    to_port         = "22"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==================
# ECS Security group
# ECS    to      RDS
# ==================
resource "aws_security_group" "rds_security_group" {
  name        = "${var.app_name}_rds_sg"
  description = "allow inbound access from the ecs tasks only"
  vpc_id      = "${aws_vpc.default.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "${var.postgres_port}"
    to_port         = "${var.postgres_port}"
    security_groups = ["${aws_security_group.ecs_security_group.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==================
# ECS Security group
# ECS    to    Cache
# ==================
resource "aws_security_group" "cache_security_group" {
  name        = "${var.app_name}_cache_sg"
  description = "allow inbound access from the ecs tasks only"
  vpc_id      = "${aws_vpc.default.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "${var.redis_port}"
    to_port         = "${var.redis_port}"
    security_groups = ["${aws_security_group.ecs_security_group.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

//
//# Public Subnet Route Table
//# =========================
//resource "aws_route_table" "public" {
//  vpc_id = "${aws_vpc.default.id}"
//
//  route {
//    cidr_block = "0.0.0.0/0"
//    gateway_id = "${aws_internet_gateway.gw.id}"
//  }
//
//  tags {
//    Name = "public subnet"
//  }
//}
//
//resource "aws_route" "public_internet_gateway" {
//  route_table_id         = "${aws_vpc.default.main_route_table_id}"
//  destination_cidr_block = "0.0.0.0/0"
//  gateway_id             = "${aws_internet_gateway.gw.id}"
//}
//
//resource "aws_route_table_association" "public" {
//  count          = "${length(var.public_subnets_cidr)}"
//  subnet_id      = "${element(aws_subnet.public_subnet.*.id, count.index)}"
//  route_table_id = "${aws_route_table.public.id}"
//  depends_on     = ["aws_vpc.default", "aws_route_table.public"]
//}
//
//# Private Subnets
//# ===============
//resource "aws_subnet" "private_subnet" {
//  vpc_id                  = "${aws_vpc.default.id}"
//  count                   = "${length(var.private_subnets_cidr)}"
//  cidr_block              = "${element(var.private_subnets_cidr, count.index)}"
//  availability_zone       = "${element(var.availability_zones, count.index)}"
//  map_public_ip_on_launch = false
//
//  tags {
//    Name = "${element(var.availability_zones, count.index)}-private-subnet"
//  }
//}
//
//resource "aws_route_table" "private" {
//  vpc_id = "${aws_vpc.default.id}"
//
//  route {
//    cidr_block = "0.0.0.0/0"
//    gateway_id = "${aws_internet_gateway.gw.id}"
//  }
//
//  tags {
//    Name = "private subnet"
//  }
//}
//
//resource "aws_route" "private_internet_gateway" {
//  route_table_id         = "${aws_route_table.private.id}"
//  destination_cidr_block = "0.0.0.0/0"
//  gateway_id             = "${aws_internet_gateway.gw.id}"
//}
//
//resource "aws_route_table_association" "private" {
//  count          = "${length(var.private_subnets_cidr)}"
//  subnet_id      = "${element(aws_subnet.private_subnet.*.id, count.index)}"
//  route_table_id = "${aws_route_table.private.id}"
//  depends_on     = ["aws_vpc.default", "aws_route_table.private"]
//}

