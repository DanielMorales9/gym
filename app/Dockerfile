FROM java
VOLUME /tmp
ARG DEPENDENCY=target/dependency

COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app

RUN ls -la /app/*

ENTRYPOINT ["java","-cp","app:app/lib/*","it.goodfellas.ApiApplication"]
