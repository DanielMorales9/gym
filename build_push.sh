#!/bin/bash
# set -e

# define arguments
for i in "$@"
do
case ${i} in
    --compile)
    COMPILE=1
    shift # past argument=value
    ;;
    *)
          # unknown option
    ;;
esac
done

# assign default values (if needed)
IMAGE=app
TAG=0.0.1-SNAPSHOT
DOCKER_USER=tenentedan9

# get the account number associated with the current IAM credentials
echo "========================="
echo "| Verify AWS account... |"
echo "========================="
ACCOUNT=$(aws sts get-caller-identity --query Account --output text --profile goodfellas)
echo "+${ACCOUNT} being used"
if [[ $? -ne 0 ]]
then
    exit 255
fi

# get the region defined in the current configuration
echo "==========================="
echo "| Configure AWS region... |"
echo "==========================="
REGION=$(aws configure get region --profile goodfellas)
echo "+${REGION} being used"

# create repository in ECR (check if exists)
echo "============================"
echo "| Create ECR repository... |"
echo "============================"
aws ecr describe-repositories --repository-names "${IMAGE}" --profile goodfellas > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
    aws ecr create-repository --repository-name "${IMAGE}" --profile goodfellas > /dev/null
    echo "+${IMAGE} repository created"
else
    echo "+${IMAGE} repository exists"
fi

# login to ECR service
echo "==========================="
echo "| Login to ECR service... |"
echo "==========================="
$(aws ecr get-login --region ${REGION} --no-include-email --profile goodfellas)


# build docker image locally
if [[ ${COMPILE} ]]; then
    echo "========================="
    echo "| Build Docker Image... |"
    echo "========================="
    mvn install -B
fi

# define the full path of the docker image
echo "============================="
echo "| Create ECR Docker Path... |"
echo "============================="
ECR_NAME="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE}"
echo "+${ECR_NAME}"

# push docker image to ECR
echo "========================"
echo "| Push Image to ECR... |"
echo "========================"
docker tag ${DOCKER_USER}/${IMAGE}:${TAG} ${ECR_NAME}:${TAG}
docker push ${ECR_NAME}:${TAG}
echo "success"
