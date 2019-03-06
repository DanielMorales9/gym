# Microservices ![pipeline status](https://travis-ci.org/DanielMorales9/micro.svg?branch=master) 


## Dependencies
- java => 1.8
- docker
- maven
- angular-cli
- terraform

## Tools

- GitKraken
- IntelliJ

## Languages
- typescript
- java
- hcl

## TODO tutorial Git Workflow
````
# get latest master commits
git pull origin master
# create new feature branch
git checkout -b <feature_branch_name>
# write code do
git add .
git commit -m "#11 my fake commit referencing my fake issue"
# if master was updated in the mean time do the rebase 
git push origin <feature_branch_name>
````

[Rebase tutorial](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

## Build the project 
````
mvn install
````

## Running Development Environment
````
docker-compose up
````
