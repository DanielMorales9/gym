install:
	mvn install

install_app:
	mvn install -pl app

test:
	mvn test

clean:
	mvn clean

up:
	docker-compose up

run: clean install up
	echo "running"

run_app: clean install_app up
	echo "running"

