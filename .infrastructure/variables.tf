variable "postgres_db" {
}

variable "postgres_password" {
}

variable "postgres_username" {
}

variable "aws_access_key" {
}

variable "aws_secret_key" {
}

variable "gmail_password" {
}

variable "gmail_username" {
}

variable "admin_password" {
}

variable "admin_email" {
}

variable "app_name" {
}

variable "account_id" {
}

variable "key_name" {
}

variable "bucket" {
}

variable "domain" {
}

variable "url" {
}

variable "remember_me_token" {
}

variable "aws_region" {
  description = "EC2 Region for the VPC"
  default     = "eu-central-1"
}

variable "vpc_cidr" {
  description = "CIDR for the whole VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["eu-central-1a", "eu-central-1b"]
}

variable "az_count" {
  default = 2
}

variable "task_port" {
  description = "the task output port"
  default     = "80"
}

variable "postgres_port" {
  description = "The postgres port"
  default     = "5432"
}

variable "multi_az" {
  description = "whether is multi az or not"
  default     = false
}

variable "rds_instance" {
  description = "The rds instance type"
  default     = "db.t2.micro"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "redis_node_type" {
  type    = string
  default = "cache.t2.micro"
}

variable "redis_port" {
  default = "6379"
}

variable "desired_capacity" {
  description = "the desired capacity for ec2 machines or ecs tasks"
  default     = 1
}

variable "max_size" {
  description = "the max capacity for ec2 machines"
  default     = 2
}

variable "min_size" {
  description = "the min capacity for ec2 machines"
  default     = 1
}

