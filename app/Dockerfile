FROM java
VOLUME /tmp
ARG DEPENDENCY=target/dependency
ARG CERT_DIRECTORY=certs/

ADD ${DEPENDENCY}/BOOT-INF/lib /app/lib
ADD ${DEPENDENCY}/META-INF /app/META-INF
ADD ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","it.goodfellas.ApiApplication"]
