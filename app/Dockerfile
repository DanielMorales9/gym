FROM java
VOLUME /tmp
ARG DEPENDENCY=target/dependency
ARG CERT_DIRECTORY=certs/

ADD ${DEPENDENCY}/BOOT-INF/lib /app/lib
ADD ${DEPENDENCY}/META-INF /app/META-INF
ADD ${DEPENDENCY}/BOOT-INF/classes /app
ADD ${CERT_DIRECTORY} /app/certs

RUN cp /app/certs/keystore.crt $JAVA_HOME/jre/lib/security && \
    cd $JAVA_HOME/jre/lib/security && \
    keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias config -file keystore.crt

ENTRYPOINT ["java","-cp","app:app/lib/*","it.goodfellas.ApiApplication"]
