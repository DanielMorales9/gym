#!/usr/bin/env bash
set -e

if [ "$TRAVIS_BRANCH" -ne "master" ]; then
    exit 0
fi

# get the account number associated with the current IAM credentials
echo "========================="
echo "| Verify AWS account... |"
echo "========================="
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "+${ACCOUNT} being used"
if [ $? -ne 0 ]
then
    exit 255
fi

# get the region defined in the current configuration
#echo "==========================="
#echo "| Configure AWS region... |"
#echo "==========================="
#REGION=$(aws configure get region)
echo "+${AWS_DEFAULT_REGION} being used"

# create repository in ECR (check if exists)
echo "============================"
echo "| Create ECR repository... |"
echo "============================"
aws ecr describe-repositories --repository-names "${IMAGE}" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    aws ecr create-repository --repository-name "${IMAGE}" > /dev/null
    echo "+${IMAGE} repository created"
else
    echo "+${IMAGE} repository exists"
fi

# login to ECR service
echo "==========================="
echo "| Login to ECR service... |"
echo "==========================="
$(aws ecr get-login --region ${AWS_DEFAULT_REGION} --no-include-email)


# define the full path of the docker image
echo "============================="
echo "| Create ECR Docker Path... |"
echo "============================="
ECR_NAME="${ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE}"
echo "+${ECR_NAME}"

# push docker image to ECR
echo "========================"
echo "| Push Image to ECR... |"
echo "========================"
docker tag ${DOCKER_USER}/${IMAGE}:${TAG} ${ECR_NAME}:${TAG}
docker push ${ECR_NAME}:${TAG}
echo "+success"
