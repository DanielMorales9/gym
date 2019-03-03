# define AWS region
# =================
provider "aws" {
  version = "~> 1.0"
  region  = "eu-central-1"
}

# manually define remote state file on S3
# =======================================
terraform {
  backend "s3" {
    bucket  = "goodfellas-state"
    key     = "terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }
}
