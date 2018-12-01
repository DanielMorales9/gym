#!/bin/bash


function log () {
    if [[ $_V -eq 1 ]]; then
        eval $@
    else
        eval $@ 1&> /dev/null
    fi
}

_V=0
_F=0
_PREFIX="tenentedan9/"

while getopts "vf" OPTION
do
  case ${OPTION} in
    v) _V=1
        echo "Verbosity output set"
       ;;
    f) _F=1
        echo "Forcing packaging..."
       ;;
    \?) echo "script usage: $(basename $0) [-v] [-f]" >&2
        exit 1
        ;;
  esac
done


declare -i n_containers=$(docker ps -aq | wc -l)
declare -i n_arguments=0
n_arguments+=$#
n_arguments+=-$_V
n_arguments+=-$_F

if [[ ${n_containers} -gt 0 ]]; then
    echo "Stopping Containers..."
    log "docker-compose down"
    n_containers=$(docker ps -aq | wc -l)
    if [ $n_containers -gt 0 ]; then
        log "docker stop $(docker ps -aq)"
        log "docker rm $(docker ps -aq)"
    fi
    echo "Containers stopped..."
fi

if  [[ ${_F} -eq 1 && ${n_arguments} -gt 0 ]]; then
 echo "Removing Images..."
 for var in "$@"
    do
        if ! [[ $var == -* ]]; then
            image="$_PREFIX$var"
            image_id=$(docker images $image -q)
            log "docker rmi $image_id"
            directory="$var/target"
            log "rm -r $directory"
            echo "Image" $var "deleted..."
        fi
    done

elif [[ ${_F} -eq 1 && ${n_arguments} -eq 0 ]]; then
    echo "Removing Images..."
    for D in `find . -maxdepth 1 -type d | egrep ^\.\/[^\.].*`
    do
        IMAGE=`docker images "$_PREFIX${D:2}" -q`
        N_IMAGES=$(docker images "$_PREFIX${D:2}" -q | wc -l)

        if [ $N_IMAGES -gt 1 ]; then
            log "docker rmi $IMAGE"
            directory="${D:2}/target"
            log "rm -r $directory"
            echo "Image" "$_PREFIX${D:2}" "deleted..."
        fi
    done

fi

if [ $n_arguments -gt 0 ]; then
    echo "Packaging images..."
    for var in "$@"
    do
        if ! [[ $var == -* ]]; then
            cd $var
            log "mvn package"
            cd ..
            echo "Image" $var "packed..."
        fi
    done
else
    echo "Packaging images..."
    log "mvn package"
    echo "Images packed..."
fi

echo "Started Containers..."
log "docker-compose up -d"
echo "Containers started..."

exit 0