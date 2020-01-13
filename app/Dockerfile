FROM openjdk:8-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=target/dependency

ADD ${DEPENDENCY}/BOOT-INF/lib /app/lib
ADD ${DEPENDENCY}/META-INF /app/META-INF
ADD ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","it.gym.Application"]
