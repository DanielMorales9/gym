variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "postgres_password" {}
variable "postgres_username" {}
variable "postgres_database_name" {}
variable "gmail_password" {}
variable "app_name" {}
variable "bucket" {}
variable "app" {}
variable "url" {}

variable "aws_region" {
  description = "EC2 Region for the VPC"
  default     = "eu-central-1"
}

variable "key_name" {
  description = "key_name"
}

variable "vpc_cidr" {
  description = "CIDR for the whole VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnets_cidr" {
  type    = "list"
  default = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_subnets_cidr" {
  type    = "list"
  default = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "availability_zones" {
  type    = "list"
  default = ["eu-central-1a", "eu-central-1b"]
}

variable "az_count" {
  default = 2
}

variable "task_port" {
  description = "the task output port"
  default     = "80"
}

variable postgres_port {
  description = "The postgres port"
  default     = "5432"
}

variable "multi_az" {
  description = "whether is multi az or not"
  default     = true
}

variable "rds_instance" {
  description = "The rds instance type"
  default     = "db.t2.micro"
}

variable "instance_type" {
  type    = "string"
  default = "t2.micro"
}

variable "redis_node_type" {
  type    = "string"
  default = "cache.t2.micro"
}

variable "redis_port" {
  default = "6379"
}
