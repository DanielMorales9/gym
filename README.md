# Microservices [![Build Status](https://travis-ci.com/DanielMorales9/gym.svg?token=sVEPqLmkxV1xuF2rpsmy&branch=master)](https://travis-ci.com/DanielMorales9/gym) [![Coverage Status](https://codecov.io/gh/DanielMorales9/GoodFellas/coverage.svg?branch=master)](https://codecov.io/gh/DanielMorales9/GoodFellas?branch=master)

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

## Git Workflow
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

# TODOs
- TODO write plan
- Follow this guidelines: [Angular 7 - Guidelines](https://medium.freecodecamp.org/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f)

