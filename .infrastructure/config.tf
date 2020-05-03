# define AWS region
# =================
provider "aws" {
  region  = "eu-central-1"
  version = "~> 2.0"
}

# manually define remote state file on S3
# =======================================
terraform {
  backend "s3" {
    bucket  = "gms-app1"
    key     = "terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }
}

