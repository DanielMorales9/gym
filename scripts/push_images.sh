#!/usr/bin/env bash
set -ex

# define arguments
for i in "$@"
do
case ${i} in
    -i=*|--image=*)
    IMAGE="${i#*=}"
    shift # past argument=value
    ;;
    -r=*|--region=*)
    AWS_DEFAULT_REGION="${i#*=}"
    shift # past argument=value
    ;;
    -u=*|--user=*)
    DOCKER_USER="${i#*=}"
    shift # past argument=value
    ;;
    *)
          # unknown option
    ;;
esac
done

# get the account number associated with the current IAM credentials
echo "========================="
echo "| Set TAG... |"
echo "========================="
TAG=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)
echo "+${TAG} latest tag"

# get the account number associated with the current IAM credentials
echo "========================="
echo "| Verify AWS account... |"
echo "========================="
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "+${ACCOUNT} being used"
if [ $? -ne 0 ]; then
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
aws ecr describe-repositories --repository-names "${IMAGE}"
if [ $? -ne 0 ]; then
    aws ecr create-repository --repository-name "${IMAGE}"
    echo "+${IMAGE} repository created"
else
    echo "+${IMAGE} repository exists"
fi
# define the full path of the docker image
echo "============================="
echo "| Create ECR Docker Path... |"
echo "============================="
ECR_NAME="${ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE}"
echo "+${ECR_NAME}"

# login to ECR service
echo "==========================="
echo "| Login to ECR service... |"
echo "==========================="
aws ecr get-login-password --region "${AWS_DEFAULT_REGION}" |\
 docker login --username "AWS" --password-stdin "${ECR_NAME}"


# push docker image to ECR
echo "========================"
echo "| Push Image to ECR... |"
echo "========================"
docker tag ${DOCKER_USER}/${IMAGE}:${TAG} ${ECR_NAME}:${TAG}
docker tag ${DOCKER_USER}/${IMAGE}:${TAG} "${ECR_NAME}:latest"
docker push ${ECR_NAME}:${TAG}
docker push "${ECR_NAME}:latest"
echo "+success"
