# define AWS region
# =================
provider "aws" {
  region  = "eu-west-1"
}

# manually define remote state file on S3
# =======================================
terraform {
  backend "s3" {
    bucket  = "goodfellas-448068747739"
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

